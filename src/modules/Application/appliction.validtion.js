import Joi from "joi";
import { generalRules } from "../../Utilities/GeneralRules.js";
import { status } from "../../Utilities/Enums.js";
//--------------------------------------------------------------applyToJobSchema--------------------------------------------------------------
export const applyJobSchema = {
  params: Joi.object({
    jobId: generalRules.id.required(),
  }),
  headers: generalRules.headers.required(),
};
//--------------------------------------------------------------acceptOrRejectSchema--------------------------------------------------------------
export const acceptOrRejectSchema = {
  params: Joi.object({
    applicationId: generalRules.id.required(),
  }),
  headers: generalRules.headers.required(),
  body: Joi.object({
    statuss: Joi.string()
      .valid(...Object.values(status))
      .required(),
  }),
};
//--------------------------------------------------------------getAllApplicationsSchema--------------------------------------------------------------
export const getAllApplicationsSchema = {
  query: Joi.object({
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
  params: Joi.object({
    jobId: generalRules.id.required(),
  }),
};
