import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    user(email: String!): User
  }

  type Mutation {
    verifyUser(email: String!): Boolean!
    addUser(input: AddUserInput!): User!
    updateUserInfo(input: UpdateUserInput!): User!
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

  input AddUserInput {
    email: String!
    admin: Boolean!
  }

  input UpdateUserInput {
    uid: ID!
    displayName: String!
    phoneNumber: String!
  }
`;

export default typeDefs;
