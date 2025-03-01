import applicationModel from "../../DB/Models/applicationModel.js";
import companyModel from "../../DB/Models/companyModel.js";
import jopOpportunityModel from "../../DB/Models/jopOpportunityModel.js";
import userModel from "../../DB/Models/userModel.js";
import { role, status } from "../../Utilities/Enums.js";
import { asyncHandler } from "../../Utilities/GlobalErrorHandling.js";
import { eventemit } from "../../Utilities/sendEmail.Event.js";

//--------------------------------------------------getApplication-----------------------------------------------------------------------

export const getAllApplication = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { skip = 0, limit = 10 } = req.query;
  const job = await jopOpportunityModel
    .findById(jobId)
    .populate({ path: "companyId" });
  if (!job) {
    return next(new Error("this job not found"));
  }

  const company = await companyModel.findById(job.companyId);
  if (!company) {
    return next(new Error("Company not found"));
  }
  if (
    company.createdBy.toString() != req.user._id.toString() &&
    !company.HRS.some((hr) => hr.toString() == req.user._id.toString())
  ) {
    return next(new Error("You are not authorized to view these applications"));
  }
  const app = await applicationModel
    .find({ jobId })
    .populate({ path: "userId", select: "userName email -_id " })
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));
  if (!app) {
    return next(new Error("no application found"));
  }
  res.status(200).json({ msg: "done", app });
});
//-----------------------------------------------------applyJob------------------------------------------------------------------------
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  const job = await jopOpportunityModel
    .findById(jobId)
    .populate({ path: "companyId", select: "HRS" });
  if (!job) {
    return res.status(400).json({ message: "Job not found" });
  }

  if (req.user.role !== role.user) {
    return res
      .status(403)
      .json({ message: "You must be a regular user to apply for a job" });
  }

  const existingApplication = await applicationModel.findOne({
    jobId,
    userId: req.user._id,
  });
  if (existingApplication) {
    return res
      .status(400)
      .json({ message: "You have already applied for this job" });
  }

  const newApplication = await applicationModel.create({
    jobId,
    userId: req.user._id,
    status: status.pending,
  });

  if (job.companyId && job.companyId.HRS) {
    job.companyId.HRS.forEach((hrId) => {
      io.to(hrId.toString()).emit("newApplication", {
        message: `A new application has been submitted for ${job.jobTitle}`,
        jobId,
        applicantId: req.user._id,
      });
    });
  }
  res.status(201).json({
    msg: "Application submitted successfully",
    application: newApplication,
  });
});

//------------------------------------------------------acceptOrReject-----------------------------------------------------------------
export const acceptOrReject = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { statuss } = req.body;

  const application = await applicationModel.findById(applicationId);
  if (!application) {
    return next(new Error("Application not found"));
  }

  if (application.status !== status.pending) {
    return next(new Error("Please wait for us"));
  }

  const job = await jopOpportunityModel.findById(application.jobId);
  if (!job) {
    return next(new Error("Job not found"));
  }

  const company = await companyModel.findById(job.companyId);
  if (!company) {
    return next(new Error("Company not found"));
  }

  if (
    !company.HRs ||
    !company.HRs.some((hr) => hr.toString() === req.user._id.toString())
  ) {
    return next(new Error("You are not authorized"));
  }

  const updatedApplication = await applicationModel.findByIdAndUpdate(
    applicationId,
    { status: statuss },
    { new: true }
  );

  const user = await userModel.findById(application.userId);
  if (!user) {
    return next(new Error("User not found"));
  }

  const result =
    statuss === status.accepted ? "You are accepted" : "You are rejected";
  eventemit.emit("applicationStatus", { email: user.email, result });

  res.status(201).json({ msg: `You are ${statuss}`, updatedApplication });
});
