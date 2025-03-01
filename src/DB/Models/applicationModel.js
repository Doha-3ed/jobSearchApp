import mongoose from "mongoose"
import { status } from "../../Utilities/Enums.js"

const applicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"jopOpportunity"
    },
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    userCV:{
        secure_url:String,
        public_id:String
    },
    status:{
        type:String,
        enum:Object.values(status),
        default:status.pending
    }
},
{
    timestamps:true
})


 const applicationModel=mongoose.model.application||mongoose.model("application",applicationSchema)
 export default applicationModel
 export const connectedUsers = new Map()