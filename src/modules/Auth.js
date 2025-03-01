import userModel from "../DB/Models/userModel.js";
import { OTPtypes, provider, role } from "../Utilities/Enums.js";
import { decodedToken, tokenTypes } from "../middleWare/Authentication.js";
import { compare, generateToken, hash } from "../Utilities/Encryption/index.js";
import { asyncHandler } from "../Utilities/GlobalErrorHandling.js";
import { eventemit } from "../Utilities/sendEmail.Event.js";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../Utilities/cloudinary/index.js";
//-------------------------------------------------------------SignUp------------------------------------------------------------------------
export const SignUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, DOB, gender, mobileNumber } = req.body;
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("Email is already exist , Enter another"));
  }

  let profilePic = {};
  let coverPic = {};
  if (req.files?.profilePic) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePic[0].path
    );
    profilePic = { secure_url: result.secure_url, public_id: result.public_id };
  }

  if (req.files?.coverPic) {
    const result = await cloudinary.uploader.upload(req.files.coverPic[0].path);
    coverPic = { secure_url: result.secure_url, public_id: result.public_id };
  }
  eventemit.emit("sendEmail", { email });
  const user = await userModel.create({
    userName,
    email,
    password,
    DOB,
    gender,
    mobileNumber,
    profilePic,
    coverPic,
  });
  res.status(201).json({ msg: "you signUp successfuly", user });
});
//-----------------------------------------------------------------confirmEmail--------------------------------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const userExist = await userModel.findOne({ email, isConfirmed: false });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) =>
      otpType.type === OTPtypes.cEmail && otpType.expiresIn > new Date()
  );
  if (!otp) {
    return next(new Error("invalid OTP"));
  }
  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("code isnot Correct"));
  }
  const user = await userModel.findOneAndUpdate(
    { email },
    { isConfirmed: true, $push: { OTP: { type: OTPtypes.cEmail } } },
    { new: true }
  );
  res.status(201).json({ msg: "done", user });
});
//-----------------------------------------------------------------SignIn--------------------------------------------------------------------
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await userModel.findOne({
    email,
    provider: provider.system,
    isConfirmed: true,
  });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const checkPass = await compare({
    key: password,
    HashedKey: userExist.password,
  });
  if (!checkPass) {
    return next(new Error("password not match"));
  }
  const refreshToken = await generateToken({
    payload: { email, userId: userExist._id },
    PRIVATE_KEY:
      userExist.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "7d",
  });
  const accessToken = await generateToken({
    payload: { email, userId: userExist._id },
    PRIVATE_KEY:
      userExist.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "1h",
  });

  res.status(201).json({
    msg: "you logedIn successfully",
    Token: {
      accessToken,
      refreshToken,
    },
  });
});
//-----------------------------------------------------------------signupWithGoogle--------------------------------------------------------------------
export const signupWithGoogle = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return next(new Error("ID token is required"));
  }
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email, email_verified, name, picture } = await verify();
  let user = await userModel.findOne({ email });
  const [firstName, ...lastNameArr] = name.split(" ");
  if (!user) {
    user = await userModel.create({
      firstName,
      lastName: lastNameArr.join(" "),
      email,
      isConfirmed: email_verified,
      profilePic: picture,
      provider: provider.google,
    });
  }

  const accessToken = await generateToken({
    payload: { email, userId: user._id },
    PRIVATE_KEY: process.env.JWT_SECRET,
    expired: "1h",
  });
  res
    .status(201)
    .json({ msg: "you signedUp Successfully", token: accessToken, user });
});
//-----------------------------------------------------------------logInWithGoogle--------------------------------------------------------------------
export const logInWithGoogle = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    return next(new Error("ID token is required"));
  }
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email } = await verify();
  let user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("user not found ,try again "));
  }
  if (user.provider != provider.google) {
    return next(new Error("login with System , please"));
  }
  const accessToken = await generateToken({
    payload: { email, userId: user._id },
    PRIVATE_KEY: process.env.JWT_SECRET,
    expired: "1h",
  });
  res.status(201).json({ msg: "you logedIn Successfully", token: accessToken });
});
//-----------------------------------------------------------------forgetPassword--------------------------------------------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email, isDeleted: false });

  if (!user) {
    return next(new Error("user not found ,try again "));
  }
  eventemit.emit("forgetPassword", { email });

  res.status(200).json({ msg: "done" });
});
//-----------------------------------------------------------------resetPassword--------------------------------------------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const userExist = await userModel.findOne({ email, isDeleted: false });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) =>
      otpType.type === OTPtypes.forgetPassword && otpType.expiresIn > new Date()
  );
  if (!otp) {
    return next(new Error("invalid OTP"));
  }
  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("code isnot Correct"));
  }
  const Hashing = await hash({
    key: newPassword,
    SALT_ROUND: process.env.SALT_ROUND,
  });
  const user = await userModel.findOneAndUpdate(
    { email },
    {
      confirmed: true,
      $push: { OTP: { type: OTPtypes.forgetPassword } },
      password: Hashing,
    },
    { new: true }
  );
  res.status(201).json({ msg: "done", user });
});
//-----------------------------------------------------------------refreshToken--------------------------------------------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.access,
  });
  const accessToken = await generateToken({
    payload: { email: user.email, userId: user._id },
    PRIVATE_KEY:
      user.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "1h",
  });

  res.status(201).json({
    msg: "token is refreshed",
    Token: {
      accessToken,
    },
  });
});
//-----------------------------------------------------------------confirmOTP--------------------------------------------------------------------

export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, code, type } = req.body;

  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) => otpType.type === type && otpType.expiresIn > new Date()
  );

  if (!otp) {
    return next(new Error("Invalid or expired OTP"));
  }

  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("Incorrect OTP"));
  }
  if (type === OTPtypes.cEmail) {
    await userModel.updateOne(
      { email },
      { isConfirmed: true, $pull: { OTP: { type: type } } }
    );
    return res.status(200).json({ msg: "Email confirmed successfully" });
  }
  if (type === OTPtypes.forgetPassword) {
    await userModel.updateOne({ email }, { $pull: { OTP: { type: type } } });
    return res.status(200).json({
      msg: "OTP verified successfully. You can now reset your password.",
    });
  }

  return next(new Error("Invalid OTP type"));
});
