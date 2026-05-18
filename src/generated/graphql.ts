export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AddResourceInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  borrower?: InputMaybe<BorrowerInput>;
  borrowerId?: InputMaybe<Scalars['String']['input']>;
  createdDate?: InputMaybe<Scalars['Float']['input']>;
  ebook: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type AddUserInput = {
  admin: Scalars['Boolean']['input'];
  email: Scalars['String']['input'];
};

export type BorrowResourceInput = {
  available: Scalars['Boolean']['input'];
  borrower: BorrowerInput;
  borrowerId: Scalars['String']['input'];
  createdDate: Scalars['Float']['input'];
  ebook: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type Borrower = {
  __typename?: 'Borrower';
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

export type BorrowerInput = {
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type LoanResource = {
  __typename?: 'LoanResource';
  available: Scalars['Boolean']['output'];
  borrower: Borrower;
  borrowerId: Scalars['String']['output'];
  createdDate: Scalars['Float']['output'];
  dateBorrowed: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  ebook: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addResource: Resource;
  addUser: User;
  borrowResource: Resource;
  removeResource: Scalars['Boolean']['output'];
  returnResource: Resource;
  updateUserInfo: User;
  verifyUser: Scalars['Boolean']['output'];
};

export type MutationAddResourceArgs = {
  input: AddResourceInput;
};

export type MutationAddUserArgs = {
  input: AddUserInput;
};

export type MutationBorrowResourceArgs = {
  input: BorrowResourceInput;
};

export type MutationRemoveResourceArgs = {
  input: RemoveResourceInput;
};

export type MutationReturnResourceArgs = {
  input: ReturnResourceInput;
};

export type MutationUpdateUserInfoArgs = {
  input: UpdateUserInput;
};

export type MutationVerifyUserArgs = {
  email: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  resources: Array<Resource>;
  resourcesByUser: Array<LoanResource>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};

export type QueryResourcesByUserArgs = {
  borrowerId: Scalars['String']['input'];
};

export type QueryUserArgs = {
  email: Scalars['String']['input'];
};

export type RemoveResourceInput = {
  createdDate: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export type Resource = {
  __typename?: 'Resource';
  available: Scalars['Boolean']['output'];
  borrower?: Maybe<Borrower>;
  borrowerId?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['Float']['output'];
  dateBorrowed?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  ebook: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type ReturnResourceInput = {
  available: Scalars['Boolean']['input'];
  createdDate: Scalars['Float']['input'];
  ebook: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type UpdateUserInput = {
  displayName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  uid: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  admin: Scalars['Boolean']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};
