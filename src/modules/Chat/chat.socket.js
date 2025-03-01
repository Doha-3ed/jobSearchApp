import { Server } from "socket.io";
import { logOut, registerAccount } from "./chat.service.js";
import { sendMessage } from "./message.service.js";


export const runIo=(httpServer)=>{
    const io= new Server(httpServer,{
        cors:"*"
    })
    
    

    io.on("connection",async(socket)=>{
       
        await registerAccount(socket)
        await sendMessage(socket)
        await logOut(socket)
    })
}