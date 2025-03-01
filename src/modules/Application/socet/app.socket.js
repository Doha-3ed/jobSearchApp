import { Server } from "socket.io";
import { connectedUsers } from "../../../DB/Models/applicationModel.js";
import { logOut, registerAccount } from "../../Chat/chat.service.js";


export const runApp = (server) => {
 const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", async(socket) => {
    console.log("A user connected:", socket.id);

    await registerAccount(socket)
  
    await logOut(socket)
})}
