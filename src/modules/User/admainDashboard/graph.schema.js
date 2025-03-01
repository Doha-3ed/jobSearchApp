import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { displayAll } from "./admainGraphql/field.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      ...displayAll,
    },
  }),
});
