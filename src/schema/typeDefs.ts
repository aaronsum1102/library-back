import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    users: [User]!
    user(email: String!): User
    resources: [Resource!]!
    resourcesByUser(borrowerId: String!): [LoanResource!]!
  }

  type Mutation {
    verifyUser(email: String!): Boolean!
    addUser(input: AddUserInput!): User!
    updateUserInfo(input: UpdateUserInput!): User!
    addResource(input: AddResourceInput!): Resource!
    borrowResource(input: BorrowResourceInput!): Resource!
    returnResource(input: ReturnResourceInput!): Resource!
    removeResource(input: RemoveResourceInput!): Boolean!
  }

  type User {
    uid: String!
    email: String!
    displayName: String
    phoneNumber: String
    admin: Boolean!
  }

  type LoanResource {
    title: String!
    createdDate: Float!
    ebook: Boolean!
    available: Boolean!
    borrowerId: String!
    borrower: Borrower!
    dateBorrowed: String!
  }

  type Resource {
    title: String!
    createdDate: Float!
    ebook: Boolean!
    available: Boolean!
    borrowerId: String
    borrower: Borrower
    dateBorrowed: String
  }

  type Borrower {
    name: String
    phoneNumber: String
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

  input AddResourceInput {
    title: String!
    createdDate: Float
    ebook: Boolean!
    available: Boolean
    borrowerId: String
    borrower: BorrowerInput
  }

  input BorrowResourceInput {
    title: String!
    createdDate: Float!
    ebook: Boolean!
    available: Boolean!
    borrowerId: String!
    borrower: BorrowerInput!
  }

  input BorrowerInput {
    name: String!
    phoneNumber: String!
  }

  input ReturnResourceInput {
    title: String!
    createdDate: Float!
    ebook: Boolean!
    available: Boolean!
  }

  input RemoveResourceInput {
    title: String!
    createdDate: Float!
  }
`;

export default typeDefs;
