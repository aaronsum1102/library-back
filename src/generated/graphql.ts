export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddUserInput = {
  email: Scalars['String'];
  admin: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  verifyUser: Scalars['Boolean'];
  addUser: User;
  updateUserInfo: User;
};

export type MutationVerifyUserArgs = {
  email: Scalars['String'];
};

export type MutationAddUserArgs = {
  input: AddUserInput;
};

export type MutationUpdateUserInfoArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  users: Array<Maybe<User>>;
  user?: Maybe<User>;
};

export type QueryUserArgs = {
  email: Scalars['String'];
};

export type UpdateUserInput = {
  uid: Scalars['ID'];
  displayName: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  uid: Scalars['String'];
  email: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  admin: Scalars['Boolean'];
};
