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

export type AddResourceInput = {
  title: Scalars['String'];
  createdDate?: Maybe<Scalars['Float']>;
  ebook: Scalars['Boolean'];
  available?: Maybe<Scalars['Boolean']>;
  borrowerId?: Maybe<Scalars['String']>;
  borrower?: Maybe<BorrowerInput>;
};

export type AddUserInput = {
  email: Scalars['String'];
  admin: Scalars['Boolean'];
};

export type BorrowResourceInput = {
  title: Scalars['String'];
  createdDate: Scalars['Float'];
  ebook: Scalars['Boolean'];
  available: Scalars['Boolean'];
  borrowerId: Scalars['String'];
  borrower: BorrowerInput;
};

export type Borrower = {
  __typename?: 'Borrower';
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type BorrowerInput = {
  name: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type LoanResource = {
  __typename?: 'LoanResource';
  title: Scalars['String'];
  createdDate: Scalars['Float'];
  ebook: Scalars['Boolean'];
  available: Scalars['Boolean'];
  borrowerId: Scalars['String'];
  borrower: Borrower;
  dateBorrowed: Scalars['String'];
  dueDate: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  verifyUser: Scalars['Boolean'];
  addUser: User;
  updateUserInfo: User;
  addResource: Resource;
  borrowResource: Resource;
  returnResource: Resource;
  removeResource: Scalars['Boolean'];
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

export type MutationAddResourceArgs = {
  input: AddResourceInput;
};

export type MutationBorrowResourceArgs = {
  input: BorrowResourceInput;
};

export type MutationReturnResourceArgs = {
  input: ReturnResourceInput;
};

export type MutationRemoveResourceArgs = {
  input: RemoveResourceInput;
};

export type Query = {
  __typename?: 'Query';
  users: Array<Maybe<User>>;
  user?: Maybe<User>;
  resources: Array<Resource>;
  resourcesByUser: Array<LoanResource>;
};

export type QueryUserArgs = {
  email: Scalars['String'];
};

export type QueryResourcesByUserArgs = {
  borrowerId: Scalars['String'];
};

export type RemoveResourceInput = {
  title: Scalars['String'];
  createdDate: Scalars['Float'];
};

export type Resource = {
  __typename?: 'Resource';
  title: Scalars['String'];
  createdDate: Scalars['Float'];
  ebook: Scalars['Boolean'];
  available: Scalars['Boolean'];
  borrowerId?: Maybe<Scalars['String']>;
  borrower?: Maybe<Borrower>;
  dateBorrowed?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
};

export type ReturnResourceInput = {
  title: Scalars['String'];
  createdDate: Scalars['Float'];
  ebook: Scalars['Boolean'];
  available: Scalars['Boolean'];
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
