import chatModel, { connectionUser } from "../../DB/Models/chatModel.js"
import { authSocket } from "../../middleWare/Authentication.js"
import { asyncHandler } from "../../Utilities/GlobalErrorHandling.js"



export const registerAccount=async(socket)=>{
    const data= await authSocket({socket})
    if(data.statusCode!=200||201){
        return socket.emit("authError",data)
    }
    console.log(connectionUser)
    connectionUser.set(data.user._id.toString(),socket.id)
    return "done"
}
export const logOut=async(socket)=>{
   return socket.on("disconnect",async()=>{
    const data= await authSocket({socket})
    if(data.statusCode!=200||201){
        return socket.emit("authError",data)
    }
    console.log(connectionUser)
    connectionUser.delete(data.user._id.toString(),socket.id)
    return "done"
   })
}
export const getChat=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params

    let chat =await chatModel.findOne({
        $or: [
            { senderId: req.user._id, receiverId: userId },
            { senderId: userId, receiverId: req.user._id }
        ]
    }).populate([{path:"senderId"},{path:"messages.senderId"}])
    if (chat.senderId._id.toString() !== req.user._id.toString() &&
    chat.receiverId._id.toString() !== req.user._id.toString()) {
    return next(new Error("Access denied"));
}
    
res.status(200).json({msg:"done",chat})
})