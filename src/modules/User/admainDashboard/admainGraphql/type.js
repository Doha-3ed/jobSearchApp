import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
export const getUserType = new GraphQLObjectType({
  name: "User",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
  },
});
export const getCompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    companyName: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    industry: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    companyEmail: { type: new GraphQLNonNull(GraphQLString) },
    approvedByAdmin: { type: GraphQLBoolean },
  },
});
 export const AllDataType = new GraphQLObjectType({
    name: "AllData",
    fields: {
      users: { type: new GraphQLList(getUserType) },
      companies: { type: new GraphQLList(getCompanyType) },
    },
  });
