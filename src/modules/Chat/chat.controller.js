import  Router  from "express";
import { authentication } from "../../middleWare/Authentication.js";
import { getChat } from "./chat.service.js";


const chatRouter=Router()
chatRouter.get("/:userId",authentication,getChat)


export default chatRouter