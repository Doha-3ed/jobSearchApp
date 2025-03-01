import companyModel from "../../../DB/Models/companyModel.js";
import userModel from "../../../DB/Models/userModel.js";
import { role } from "../../../Utilities/Enums.js";
import { asyncHandler } from "../../../Utilities/GlobalErrorHandling.js";

export const banUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userModel.findOne({ _id: userId, isConfirmed: true });
  if (!user) {
    return next(new Error("user not Found"));
  }
  let banUser;
  if (user.bannedAt == null) {
    banUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { bannedAt: new Date() } },
      { new: true }
    );
  } else {
    banUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { bannedAt: null } },
      { new: true }
    );
  }
  res.status(201).json({ msg: "done", banUser });
});
export const banCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findOne({ _id: companyId });
  if (!company) {
    return next(new Error("company not Found"));
  }
  let bancompany;
  if (company.bannedAt == null) {
    bancompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $set: { bannedAt: new Date() } },
      { new: true }
    );
  } else {
    bancompany = await companyModel.findOneAndUpdate(
      { _id: companyId },
      { $set: { bannedAt: null } },
      { new: true }
    );
  }
  res.status(201).json({ msg: "done", bancompany });
});
export const approveCompany = asyncHandler(async (req, res, next) => {
  const { companyId,userId } = req.params;
  
  const company = await companyModel.findOne({ _id: companyId });
  if (!company) {
    return next(new Error("company not Found"));
  }
  if (company.approvedByAdmin) {
    return next(new Error("company already approved"));
  }
  const user=await userModel.findById(userId)
  if(user.role!==role.admin){
    return next(new Error("you are not outhorized"))
  }
  await companyModel.findOneAndUpdate(
    { _id: companyId ,createdBy:userId},
    { $set: { approvedByAdmin: true } },
    { new: true }
  );
  res.status(201).json({ msg: "Company is approved sucessfuly" });
});
