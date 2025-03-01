import connectionDb from "./DB/DBconnection.js";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { errorHandling } from "./Utilities/GlobalErrorHandling.js";
import { generalLimiter, loginLimiter } from "./middleWare/rateLimit.js";
import { expiredOTPs } from "./Utilities/CRONjobs.js";
import userRouter from "./modules/User/user.controller.js";
import { schema } from "./modules/User/admainDashboard/graph.schema.js";
import { createHandler } from "graphql-http";
import companyRouter from "./modules/Company/company.controller.js";
import jobRouter from "./modules/jopOpportunity/job.controller.js";
import applicationRouter from "./modules/Application/application.controller.js";
import chatRouter from "./modules/Chat/chat.controller.js";
const bootStrap = (express, app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(generalLimiter);
  app.set("strict routing", true);
  app.set("case sensitive routing", true);
  app.use("/graphQl", createHandler({ schema }));
  app.use("/downloads", express.static(path.resolve("downloads")));
  expiredOTPs();
  connectionDb();
  app.use(generalLimiter)
  app.use("/user", userRouter);
  app.use("/user/login", loginLimiter, userRouter)
  app.use("/company",companyRouter)
  app.use("/job",jobRouter)
  app.use("/application",applicationRouter)
app.use("/chat",chatRouter)
  app.use("*", (req, res, next) => {
    return next(new Error("invalid URL"));
  });
  app.use(errorHandling);
};
export default bootStrap;
