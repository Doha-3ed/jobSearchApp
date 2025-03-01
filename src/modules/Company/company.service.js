import companyModel from "../../DB/Models/companyModel.js";
import cloudinary from "../../Utilities/cloudinary/index.js";
import { role } from "../../Utilities/Enums.js";
import { asyncHandler } from "../../Utilities/GlobalErrorHandling.js";
import { eventemit } from "../../Utilities/sendEmail.Event.js";

//--------------------------------------------------------addCompany--------------------------------------------------------------------------------
export const addCompany = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findOne({
    companyEmail: req.body.companyEmail,
    companyName: req.body.companyName,
  });
  if (company) {
    return next(new Error("This Company already exist"));
  }
  eventemit.emit("sendEmail", { companyEmail: req.body.companyEmail });

  let Logo = {};
  let coverPic = {};
  if (req.files?.Logo) {
    const result = await cloudinary.uploader.upload(req.files.Logo[0].path);
    Logo = { secure_url: result.secure_url, public_id: result.public_id };
  }

  if (req.files?.coverPic) {
    const result = await cloudinary.uploader.upload(req.files.coverPic[0].path);
    coverPic = { secure_url: result.secure_url, public_id: result.public_id };
  }
  const newComp = await companyModel.create({ ...req.body, coverPic, Logo });
  res.status(201).json({ msg: "Company has been added sucessfully", newComp });
});
//--------------------------------------------------------updateCompanyData--------------------------------------------------------------------------------
export const updateCompanyData = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findOne({ _id: companyId });
  if (!company) {
    return next(new Error("company doesn't Exist"));
  }
  if (!company.createdBy == req.user._id) {
    return next(new Error("you are not the owner"));
  }
  if (req.body.legalAttachment) {
    return next(new Error("you can't update this attachment"));
  }
  const newComp = await companyModel.findByIdAndUpdate(
    { _id: companyId },
    { $set: req.body, updatedBy: req.user._id },
    { new: true }
  );
  res
    .status(201)
    .json({ msg: "Company has been updated sucessfully", newComp });
});
//--------------------------------------------------------softDelete--------------------------------------------------------------------------------
export const softDelete = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findOne({
    _id: companyId,
    isDeleted: false,
  });
  if (!company) {
    return next(new Error("company not Found"));
  }
  if (
    !company.createdBy.toString() == req.user._id &&
    req.user.role !== role.admin
  ) {
    return next(new Error("you are not the owner or admin"));
  }

  await companyModel.findOneAndUpdate(
    { _id: company._id },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  res.status(201).json({ msg: "softDelete is Done" });
});
//--------------------------------------------------------getCompanyWithJobs--------------------------------------------------------------------------------
export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  const company = await companyModel.findById(companyId).populate("jobs");

  if (!company) {
    return next(new Error("Company not found"));
  }

  res.status(200).json({ msg: "Company details", company });
});
//-------------------------------------------------------searchCompanyName------------------------------------------------------------------------------

export const searchCompanyName = asyncHandler(async (req, res, next) => {
  const { companyName } = req.params;

  const company = await companyModel.findOne({ companyName });
  
  if (!company) {
    return next(new Error("Company not found"));
  }

  res.status(200).json({ msg: "Company details", company });
});
//--------------------------------------------------------uploadLogo--------------------------------------------------------------------------------

export const uploadLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);

  if (!company) {
    return next(new Error("Company not found"));
  }
  if (req.user._id.toString() !== company.createdBy.toString()) {
    return next(new Error("you are not the owner"));
  }
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "Logos",
  });

  company.Logo = { secure_url: result.secure_url, public_id: result.public_id };
  await company.save();

  res.status(200).json({ msg: "Company logo uploaded successfully", company });
});
//--------------------------------------------------------uploadCoverPic--------------------------------------------------------------------------------

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);

  if (!company) {
    return next(new Error("Company not found"));
  }
  if (req.user._id.toString() !== company.createdBy.toString()) {
    return next(new Error("you are not the owner"));
  }
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "company_cover",
  });

  company.coverPic = {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
  await company.save();

  res
    .status(200)
    .json({ msg: "Company cover picture uploaded successfully", company });
});
//--------------------------------------------------------deleteLogo--------------------------------------------------------------------------------
export const deleteLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);

  if (!company || !company?.Logo) {
    return next(new Error("No company logo found"));
  }
  if (req.user._id.toString() !== company.createdBy.toString()) {
    return next(new Error("you are not the owner"));
  }
  await cloudinary.uploader.destroy(company.Logo.public_id);
  company.Logo = { secure_url: "", public_id: "" };
  await company.save();

  res.status(200).json({ msg: "Company logo deleted successfully" });
});
//--------------------------------------------------------deleteCoverPic--------------------------------------------------------------------------------
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);

  if (!company || !company?.coverPic) {
    return next(new Error("No company cover picture found"));
  }
  if (req.user._id.toString() !== company.createdBy.toString()) {
    return next(new Error("you are not the owner"));
  }
  await cloudinary.uploader.destroy(company.coverPic.public_id);
  company.coverPic = { secure_url: "", public_id: "" };
  await company.save();

  res.status(200).json({ msg: "Company cover picture deleted successfully" });
});
