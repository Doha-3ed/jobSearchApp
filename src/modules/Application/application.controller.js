import Router from "express";
import { authentication } from "../../middleWare/Authentication.js";

import {
  acceptOrReject,
  applyToJob,
  getAllApplication,
} from "./application.service.js";
import { validation } from "../../middleWare/Validation.js";
import {
  acceptOrRejectSchema,
  applyJobSchema,
  getAllApplicationsSchema,
} from "./appliction.validtion.js";

const applicationRouter = Router();
applicationRouter.post(
  "/:jobId",
  authentication,
  validation(applyJobSchema),
  applyToJob
);
applicationRouter.patch(
  "/acceptOrReject/:applicationId",
  authentication,
  validation(acceptOrRejectSchema),
  acceptOrReject
);
applicationRouter.get(
  "/getAll/:jobId",
  authentication,
  validation(getAllApplicationsSchema),
  getAllApplication
);
export default applicationRouter;
