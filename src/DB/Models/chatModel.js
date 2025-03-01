import mongoose from "mongoose"

const chatSchema=new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true
      }, 
      receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
      }, 
      messages: [
        {
          message: { type: String, required: true }, 
          senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
          
        }
      ]
},
{
    timestamps:true
})


 const chatModel=mongoose.model.chat||mongoose.model("chat",chatSchema)
 export default chatModel

 export const connectionUser=new Map()