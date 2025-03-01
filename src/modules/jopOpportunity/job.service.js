import companyModel from "../../DB/Models/companyModel.js";
import jopOpportunityModel from "../../DB/Models/jopOpportunityModel.js";

import { asyncHandler } from "../../Utilities/GlobalErrorHandling.js";

//--------------------------------------------------------addJob--------------------------------------------------------------------------------
export const addJob = asyncHandler(async (req, res, next) => {
  const { companyName } = req.params;
  const company = await companyModel.findOne({ companyName });
  if (!company) {
    return next(new Error("Company not found"));
  }

  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not the owner"));
  }

  if (!company.HRs.includes(req.user._id.toString())) {
    return next(new Error("You are not an HR of this company"));
  }
  const job = await jopOpportunityModel.create({
    ...req.body,
    companyId: company._id,addedBy:req.user._id
  });

  res.status(201).json({ msg: "Job has been added successfully", job });
});
//--------------------------------------------------------updateJob--------------------------------------------------------------------------------
export const updateJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const job = await jopOpportunityModel.findOne({
    companyId,
    _id: jobId,
  });

  if (!job) {
    return next(new Error("This job was not found"));
  }
  if (job.addedBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not the owner"));
  }
  const updatedJob = await jopOpportunityModel.findByIdAndUpdate(
    jobId,
    { ...req.body, $push: { updatedBy: req.user._id } },
    { new: true }
  );

  res
    .status(200)
    .json({ msg: "Job has been updated successfully", updatedJob });
});
//--------------------------------------------------------deleteJob--------------------------------------------------------------------------------
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const job = await jopOpportunityModel.findOne({
    company: companyId,
    _id: jobId,
  });

  if (!job) {
    return next(new Error("This job was not found"));
  }
  const company = await companyModel.findById(companyId);
  if (
    job.addedBy.toString() !== req.user._id.toString() &&
    !company.HRs.some((hr) => hr.toString() === req.user._id.toString())
  ) {
    return next(new Error("You are not the owner"));
  }
  const updatedJob = await jopOpportunityModel.findByIdAndDelete(jobId);

  res
    .status(200)
    .json({ msg: "Job has been deleted successfully", updatedJob });
});
//--------------------------------------------------------getJobsWithCompany--------------------------------------------------------------------------------
export const getJobsWithCompany = asyncHandler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { companyName } = req.query;

  let filter = {};
  if (companyId) {
    filter.companyId = companyId;
  }

  if (jobId) {
    filter._id = jobId;
  }
  
  if (companyName) {
    const company = await companyModel.findOne({ companyName });
    if (!company) {
      return next(new Error("Company not found"));
    }
    filter.companyId = company._id;
  }
 
  const jobs = await jopOpportunityModel
    .find(filter)
    .populate({path:"companyId",select:"companyName industry"})
    .sort({ createdAt: -1 })
    .skip(0)
    .limit(2)
  const totalCount = await jopOpportunityModel.countDocuments(filter);

  if (jobs.length===0) {
    return next(new Error("No jobs found"));
  }

  res.status(200).json({
    msg: "Jobs details successfully",
    totalJobs: totalCount,
    jobs,
  });
});
//--------------------------------------------------------filterJobs--------------------------------------------------------------------------------
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { skip = 0, limit = 10} = req.query;
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;

  let filter = {};
  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills) {
    const skillsArray = technicalSkills.split(",");
    filter.technicalSkills = { $all: skillsArray };
  }

  const jobs = await jopOpportunityModel
    .find(filter)
    .populate({path:"companyId",select: "companyName industry -_id"})
    .sort({createdAt: -1})
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  const totalCount = await jopOpportunityModel.countDocuments(filter);

  if (jobs.length===0) {
    return next(new Error("No jobs found matching the filters"));
  }

  res.status(200).json({
    msg: "Jobs retrieved successfully",
    totalJobs: totalCount,
    jobs,
  });
});
