import Joi from "joi";
import { generalRules } from "../../Utilities/GeneralRules.js";
import { gender, OTPtypes, role } from "../../Utilities/Enums.js";

//----------------------------------------------------------signUpSchema----------------------------------------------------------------------------
export const signUpSchema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).required(),

    password: generalRules.password.required(),
    repeat_password: Joi.valid(Joi.ref("password")).required(),

    mobileNumber: Joi.string()
      .pattern(/^[+]?[0-9]{10,15}$/)
      .required(),

    DOB: Joi.date().required(),

    email: generalRules.email.required(),
    gender: Joi.string()
      .valid(...Object.values(gender))
      .required(),
  }),

  file: Joi.object({
    profilePic: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }).optional(),
    coverPic: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }).optional(),
  }),
};

//----------------------------------------------------------confirmEmailSchema----------------------------------------------------------------------------
export const confirmEmailSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().length(4).required(),
  }),
};
//----------------------------------------------------------confirmOTPSchema----------------------------------------------------------------------------
export const confirmOTPSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().length(4).required(),
    type: Joi.string()
      .valid(...Object.values(OTPtypes))
      .required(),
  }),
};

//----------------------------------------------------------logInSchema----------------------------------------------------------------------------
export const loginSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};
//----------------------------------------------------------signUpWithGoogleSchema----------------------------------------------------------------------------
export const signUpWithGoogleSchema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }),
};
//----------------------------------------------------------logInWithGoogleSchema----------------------------------------------------------------------------
export const logInWithGoogleSchema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }),
};

//----------------------------------------------------------updatePasswordSchema----------------------------------------------------------------------------
export const updatePasswordSchema = {
  body: Joi.object({
    oldPass: generalRules.password.required(),
    newPass: generalRules.password.required(),
    cPassword: Joi.valid(Joi.ref("newPass")).required(),
  }),

  headers: generalRules.headers.required(),
};

//----------------------------------------------------------refreshTokenSchema----------------------------------------------------------------------------
export const refreshTokeSchema = {
  headers: generalRules.headers.required(),
};

//----------------------------------------------------------forgetPasswordSchema----------------------------------------------------------------------------
export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
  }),
};

//----------------------------------------------------------resetPasswordSchema----------------------------------------------------------------------------
export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().required(),
    newPassword: generalRules.password.required(),
    cPassword: Joi.valid(Joi.ref("newPassword")).required(),
  }),
};

//----------------------------------------------------------softDeleteSchema----------------------------------------------------------------------------
export const softDeleteSchema = {
  headers: generalRules.headers.required(),
};
//----------------------------------------------------------updateAccountSchema----------------------------------------------------------------------------
export const updateAccountSchema = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(30).optional(),
    lastName: Joi.string().min(2).max(30).optional(),
    DOB: Joi.date().optional(),
    gender: Joi.string()
      .valid(...Object.values(gender))
      .optional(),
    mobileNumber: Joi.string()
      .pattern(/^[+]?[0-9]{10,15}$/) // Ensures a valid phone number format
      .optional(),
  }),
  headers: generalRules.headers.required(),
};
//----------------------------------------------------------uploadProfilePicSchema----------------------------------------------------------------------------
export const uploadProfilePicSchema = {
  file: generalRules.file.optional(),

  headers: generalRules.headers.required(),
};
//----------------------------------------------------------deletePicPicSchema----------------------------------------------------------------------------
export const deletePicPicSchema = {
  headers: generalRules.headers.required(),
};
//----------------------------------------------------------bannSchema----------------------------------------------------------------------------
export const bannSchema = {
  params: Joi.object({
    userId: generalRules.id,
  }).required(),
  headers: generalRules.headers.required(),
};
