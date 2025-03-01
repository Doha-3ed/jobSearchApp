import { GraphQLList } from "graphql";
import { getCompany, getUser } from "../admainGraphql/resolve.js";
import { AllDataType, getCompanyType, getUserType } from "./type.js";
export const displayAll = {
  getUser: {
    type: new GraphQLList(getUserType),
    resolve: getUser,
  },
  getCompany: {
    type: new GraphQLList(getCompanyType),
    resolve: getCompany,
  },
  getAllData: {
    type: AllDataType, 
    resolve: async () => ({
      users:getUser,
      companies: getCompany,
    })}
};
