import express from "express";
import dotenv from "dotenv";
import path from "path";
import bootStrap from "./src/app.controller.js";
import { runIo } from "./src/modules/Chat/chat.socket.js";
import { runApp } from "./src/modules/Application/socet/app.socket.js";
//import { runApp } from "./src/modules/Application/socket/app.socket.js";

dotenv.config({ path: path.resolve("src/config/.env") });
const app = express();
const port = process.env.PORT;
bootStrap(express, app);
 const httpServer=app.listen(port, () => {
  console.log(`Server is Running at ${port}`);
});
runIo(httpServer)
runApp(httpServer)
