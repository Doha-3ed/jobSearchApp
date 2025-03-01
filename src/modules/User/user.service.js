import userModel from "../../DB/Models/userModel.js";
import { compare, decrypt, encrypt, hash } from "../../Utilities/Encryption/index.js";
import { asyncHandler } from "../../Utilities/GlobalErrorHandling.js";
import cloudinary from "../../Utilities/cloudinary/index.js";

//--------------------------------------------------------updateAccount--------------------------------------------------------------------------------
export const updateAccount = asyncHandler(async (req, res, next) => {
  if (req.body.mobileNumber) {
    req.body.mobileNumber = await encrypt({
      key: req.body.mobileNumber,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }

  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    lean: true,
  });

  if (!user) {
    return next(new Error("User not found"));
  }

  res.status(201).json({ msg: "done", user });
});
//--------------------------------------------------------getAccount--------------------------------------------------------------------------------
export const getAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("-OTP -password");

  if (!user) {
    return next(new Error("User not found"));
  }
  

  res.status(201).json({ msg: "done", user });
});
//--------------------------------------------------------getAnotherUser--------------------------------------------------------------------------------
export const getAnotherUser = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.body.userId)
    .select("userName mobileNumber profilePic coverPic");

  if (!user) {
    return next(new Error("User not found"));
  }
  if (user.mobileNumber) {
    user.mobileNumber = await decrypt({
      key: user.mobileNumber,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }

  res.status(201).json({ msg: "done", user });
});
//--------------------------------------------------------updatePassword--------------------------------------------------------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPass, newPass } = req.body;

  const isMatch = await compare({
    key: oldPass,
    HashedKey: req.user.password,
  });
  if (!isMatch) {
    return next(new Error("invalid password"));
  }
  const hashed = await hash({ key: newPass ,SALT_ROUND:process.env.SALT_ROUND});

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hashed, changeCredentialTime: Math.floor(Date.now() / 1000) },
    { new: true, lean: true }
  );

  res.status(201).json({ msg: "done", user });
});
//--------------------------------------------------------uploadProfile--------------------------------------------------------------------------------
export const uploadProfile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }
  const profile = await cloudinary.uploader.upload(req.file.path);

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: {
        secure_url: profile.secure_url,
        public_id: profile.public_id,
      },
    },
    { new: true, lean: true }
  );

  res.status(201).json({ msg: "Profile picture updated", user });
});
//--------------------------------------------------------uploadCover--------------------------------------------------------------------------------
export const uploadCover = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }
  const cover = await cloudinary.uploader.upload(req.file.path);

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { coverPic: { secure_url: cover.secure_url, public_id: cover.public_id } },
    { new: true, lean: true }
  );

  res.status(201).json({ msg: "cover picture updated", user });
});
//--------------------------------------------------------deleteCover--------------------------------------------------------------------------------
export const deleteCover = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user?.coverPic) {
    return next(new Error("No cover picture found"));
  }
  await cloudinary.uploader.destroy(user.coverPic.public_id);
  user.coverPic = { secure_url: "", public_id: "" };
  await user.save();

  res.status(201).json({ msg: "cover picture deleted" });
});
//--------------------------------------------------------deleteProfile--------------------------------------------------------------------------------
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user?.profilePic) {
    return next(new Error("No profile picture found"));
  }
  await cloudinary.uploader.destroy(user.profilePic.public_id);
  user.profilePic = { secure_url: "", public_id: "" };
  await user.save();

  res.status(201).json({ msg: "profile picture deleted" });
});
//--------------------------------------------------------softDelete--------------------------------------------------------------------------------
export const softDelete = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("user not Found"));
  }

  await userModel.findOneAndUpdate(
    { _id: user._id },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  res.status(201).json({ msg: "softDelete is Done" });
})
