import companyModel from "../../../../DB/Models/companyModel.js";
import userModel from "../../../../DB/Models/userModel.js";

export const getUser = async () => {
  const user = await userModel.find({});

  return user;
};
export const getCompany = async () => {
  const user = await companyModel.find({});

  return user;
};
