import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    user(email: String!): User
  }

  type Mutation {
    verifyUser(email: String!): Boolean!
  }

  type User {
    uid: String!
    email: String!
    displayName: String
    phoneNumber: String
    customClaims: UserCustomClaims
  }

  type UserCustomClaims {
    admin: Boolean
  }
`;

export default typeDefs;
