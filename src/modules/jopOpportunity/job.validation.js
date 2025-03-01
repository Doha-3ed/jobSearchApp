import { location, workingTime } from "../../Utilities/Enums.js";
import { generalRules } from "../../Utilities/GeneralRules.js";
import Joi from "joi";

//------------------------------------------------addJobSchema----------------------------------------------------------------------------
export const addjobSchema = {
  params: Joi.object({
    companyName: Joi.string().alphanum().min(3).max(30).required(),
  }),
  body:Joi.object({
    jobTitle: Joi.string().alphanum().min(3).max(30).required(),
    jobLocation: Joi.string()
      .valid(...Object.values(location))
      .required(),
    workingTime: Joi.string()
      .valid(...Object.values(workingTime))
      .required(),
    seniorityLevel: Joi.string().min(3).max(30).required(),
    jobDescription: Joi.string().min(3).max(30).optional(),
    technicalSkills: Joi.string().min(3).max(30).optional(),
    softSkills: Joi.string().min(3).max(30).optional(),
    addedBy:generalRules.id.required()
  })
};
//-------------------------------------------------updateJobSchema---------------------------------------------------------------------------

export const updateJobSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id.required(),
  }),
  body: Joi.object({
    jobTitle: Joi.string().alphanum().min(3).max(30).optional(),
    jobLocation: Joi.string()
      .valid(...Object.values(location))
      .optional(),
    workingTime: Joi.string()
      .valid(...Object.values(workingTime))
      .optional(),
    seniorityLevel: Joi.string().min(3).max(30).optional(),
    jobDescription: Joi.string().min(3).max(30).optional(),
    technicalSkills: Joi.string().min(3).max(30).optional(),
    softSkills: Joi.string().min(3).max(30).optional(),
  }),
};
//-------------------------------------------------deleteJobSchema---------------------------------------------------------------------------

export const deletejobSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id.required(),
  }),
};
//-------------------------------------------------getJobsWithCompanySchema---------------------------------------------------------------------------

export const getJobsWithCompanySchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    jobId: generalRules.id.required(),
  }),
  query: Joi.object({
    companyName: Joi.string().alphanum().min(3).max(30).required()
  }),
};
//-------------------------------------------------getfilteredJobsSchema---------------------------------------------------------------------------

export const getfilteredJobsSchema = {
  query: Joi.object({
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
   
  }),
  body: Joi.object({
    jobTitle: Joi.string().alphanum().min(3).max(30).optional(),
    jobLocation: Joi.string()
      .valid(...Object.values(location))
      .optional(),
    workingTime: Joi.string()
      .valid(...Object.values(workingTime))
      .optional(),
    seniorityLevel: Joi.string().min(3).max(30).optional(),
    jobDescription: Joi.string().min(3).max(30).optional(),
    technicalSkills: Joi.string().min(3).max(30).optional(),
  }),
};
