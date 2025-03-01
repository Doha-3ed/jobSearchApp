import Router from "express";
import { validation } from "../../middleWare/Validation.js";
import * as JS from "../jopOpportunity/job.service.js";
import * as JV from "../jopOpportunity/job.validation.js";
import { authentication } from "../../middleWare/Authentication.js";

const jobRouter = Router({ mergeParams: true });

jobRouter.post("/:companyName", validation(JV.addjobSchema),authentication, JS.addJob);
jobRouter.patch(
  "/updatejob/:jobId/:companyId",
  validation(JV.updateJobSchema),
  authentication,
  JS.updateJob
);
jobRouter.delete(
  "/deletejob/:jobId/:companyId",

  validation(JV.deletejobSchema),
  authentication,
  JS.deleteJob
);
jobRouter.get(
  "/getJobCompany/:jobId/:companyId",

  validation(JV.getJobsWithCompanySchema),
  JS.getJobsWithCompany
);
jobRouter.get(
  "/getFilteredJobs",

  validation(JV.getfilteredJobsSchema),
  JS.getFilteredJobs
);

export default jobRouter;
