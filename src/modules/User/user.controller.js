import Router from "express";
import { validation } from "../../middleWare/Validation.js";
import * as UV from "./user.validation.js";
import * as UA from "../Auth.js";
import { fileTypes, multerHost } from "../../middleWare/multer.js";
import {
  deleteCover,
  softDelete,
  updateAccount,
  updatePassword,
  uploadCover,
  uploadProfile,
} from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middleWare/Authentication.js";
import { role } from "../../Utilities/Enums.js";
import { banUser } from "./admainDashboard/admain.service.js";
const userRouter = Router();

userRouter.post(
  "/",
  multerHost(fileTypes.image).fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  validation(UV.signUpSchema),
  UA.SignUp
);
userRouter.patch(
  "/confirmEmail",
  validation(UV.confirmEmailSchema),
  UA.confirmEmail
);
userRouter.patch("/confirmOTP", validation(UV.confirmOTPSchema), UA.confirmOTP);

userRouter.post("/login", validation(UV.loginSchema), UA.signIn);
userRouter.post(
  "/signUpWithGmail",
  validation(UV.signUpWithGoogleSchema),
  UA.signupWithGoogle
);
userRouter.post(
  "/loginWithGmail",
  validation(UV.logInWithGoogleSchema),
  UA.logInWithGoogle
);
userRouter.get(
  "/refreshToken",
  validation(UV.refreshTokeSchema),
  UA.refreshToken
);
userRouter.patch(
  "/forgetPassword",
  validation(UV.forgetPasswordSchema),
  UA.forgetPassword
);
userRouter.patch(
  "/resetPassword",
  validation(UV.resetPasswordSchema),
  UA.resetPassword
);

userRouter.patch(
  "/updatePassword",
  validation(UV.updatePasswordSchema),
  authentication,
  updatePassword
);
userRouter.patch(
  "/updateAccount",
  validation(UV.updateAccountSchema),
  authentication,
  updateAccount
);
userRouter.patch(
  "/uploadProfilePic",
  multerHost(fileTypes.image).single("profilePic"),
  validation(UV.uploadProfilePicSchema),
  authentication,
  uploadProfile
);
userRouter.patch(
  "/uploadcoverPic",
  multerHost(fileTypes.image).single("coverPic"),
  validation(UV.uploadProfilePicSchema),
  authentication,
  uploadCover
);
userRouter.delete(
  "/deletecoverPic",
  
  validation(UV.deletePicPicSchema),
  authentication,
  deleteCover
);

userRouter.delete(
  "/softDelete",
  validation(UV.softDeleteSchema),
  authentication,
  softDelete
);
userRouter.patch(
  "/banOrUnbann/:userId",
  authentication,
  authorization(role.admin),
  banUser
);
export default userRouter;
