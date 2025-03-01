import chatModel, { connectionUser } from "../../DB/Models/chatModel.js";
import { authSocket } from "../../middleWare/Authentication.js";
import { role } from "../../Utilities/Enums.js";

export const startChat = async (socket) => {
  socket.on("startConversation", async (messageInfo) => {
    const { destId, message } = messageInfo;
    const data = await authSocket({ socket });
    if (data.statusCode != 200 || 201) {
      return socket.emit("authError", data);
    }

    const user = data.user;
    if (user.role !== role.HR && user.role !== role.companyOwner) {
      return { message: "Only HR or Company Owner can start a conversation" };
    }

    let chat = await chatModel.findOne({
      $or: [
        { senderId: user._id, receiverId: destId },
        { senderId: destId, receiverId: user._id },
      ],
    });

    if (!chat) {
      chat = await chatModel.create({
        senderId: user._id,
        receiverId: destId,
        messages: [],
      });
    }

    socket.emit("successMessage", { message });
  });
};
export const sendMessage = async (socket) => {
  socket.on("sendMessage", async (messageInfo) => {
    const { destId, message } = messageInfo;
    const data = await authSocket({ socket });
    if (data.statusCode != 200 || 201) {
      return socket.emit("authError", data);
    }
    const userId = data.user._id;
    let chat = await chatModel.findOneAndUpdate(
      {
        $or: [
          { senderId: userId, receiverId: destId },
          { senderId: destId, receiverId: userId },
        ],
      },
      { $push: { messages: { senderId: userId, message } } },
      { new: true }
    );
    if (!chat) {
      await chatModel.create({
        senderId: userId,
        receiverId: destId,
        messages: [{ senderId: userId, message }],
      });
    }
    socket.emit("successMessage", { message });
    socket
      .to(connectionUser.get(destId))
      .emit("recieveMessage", { message, chat });
  });
};
