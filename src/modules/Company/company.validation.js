import Joi from "joi";
import { generalRules } from "../../Utilities/GeneralRules.js";
//----------------------------------------------------------addCompanySchema----------------------------------------------------------------------------
export const addCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().alphanum().min(3).max(30).required(),

    companyEmail: generalRules.email.required(),
    description: Joi.string().min(3).max(30).optional(),
    industry: Joi.string().required(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
    }),
    numberOfEmployees: Joi.string()
      .pattern(/^\d+-\d+$/)
      .required(),

    createdBy: generalRules.id.required(),
  }),

  file: Joi.object({
    coverPic: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }),
    Logo: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }),
  }),
};
//----------------------------------------------------------updateCompanySchema----------------------------------------------------------------------------
export const updateCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().optional(),
    description: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
    }).optional(),
    numberOfEmployees: Joi.string()
      .pattern(/^\d+-\d+$/)
      .optional(),
  }),

  file: Joi.object({
    coverPic: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }),
    Logo: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }),
  }).optional(),
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),

  headers: generalRules.headers.required(),
};
//----------------------------------------------------------softDeleteSchema----------------------------------------------------------------------------
export const softDeleteSchema = {
  headers: generalRules.headers.required(),
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),
};
//----------------------------------------------------------uploadPicSchema----------------------------------------------------------------------------

export const uploadPicSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),
  file: generalRules.file.required(),
};
//----------------------------------------------------------deletePicSchema----------------------------------------------------------------------------

export const deletePicSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),
};
//----------------------------------------------------------getCompanyWithJobSchema----------------------------------------------------------------------------

export const getCompanyWithJobSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),
};
//----------------------------------------------------------searchCompanySchema----------------------------------------------------------------------------

export const searchCompanySchema = {
  params: Joi.object({
    companyName: Joi.string().alphanum().min(3).max(30).required(),
  }),
};

//----------------------------------------------------------approvedByAdminSchema----------------------------------------------------------------------------

export const approvedByAdminSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
    userId: generalRules.id.required(),
  }),
};
