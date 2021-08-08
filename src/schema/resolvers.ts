import { Config, AuthenticationError, UserInputError } from 'apollo-server-micro';
import { GraphQLResolveInfo } from 'graphql';

import { Context } from '../apollo';
import { UserService, ResourceService } from '../service';
import {
  User,
  QueryUserArgs,
  MutationVerifyUserArgs,
  MutationAddUserArgs,
  MutationUpdateUserInfoArgs,
  Resource,
  LoanResource,
  QueryResourcesByUserArgs,
  MutationAddResourceArgs,
  MutationBorrowResourceArgs,
  MutationReturnResourceArgs,
  MutationRemoveResourceArgs
} from '../generated/graphql';

interface ApiMethod<TResult, TArgs> {
  (parent: unknown, args: TArgs, context: Context, info: GraphQLResolveInfo):
    | Promise<TResult>
    | TResult;
}

const privateResolver = <TResult, TArgs>(
  parent: unknown,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo,
  resolver: ApiMethod<TResult, TArgs>
): Promise<TResult> | TResult => {
  if (!context.authentication.isAuthenticated) {
    throw new AuthenticationError(context.authentication.message);
  }

  return resolver(parent, args, context, info);
};

const users: ApiMethod<User[], unknown> = async (parent, args, context) => {
  const service = new UserService(context.firebaseApp);

  return await service.getAllUser();
};

const user: ApiMethod<User, QueryUserArgs> = async (__, args, context) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.getUserByEmail(args.email);

  return user;
};

const resources: ApiMethod<Resource[], unknown> = async () => {
  const service = ResourceService.getInstance();
  const resources = await service.getAllResources();

  return resources;
};

const resourcesByUser: ApiMethod<LoanResource[], QueryResourcesByUserArgs> = async (__, args) => {
  const service = ResourceService.getInstance();
  const resources = await service.getResourcesByBorrowerId(args.borrowerId);

  return resources;
};

const addUser: ApiMethod<User, MutationAddUserArgs> = async (__, args, context) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.addUser(args.input);

  return user;
};

const updateUserInfo: ApiMethod<User, MutationUpdateUserInfoArgs> = async (__, args, context) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.updateUserInfo(args.input);

  return user;
};

const addResource: ApiMethod<Resource, MutationAddResourceArgs> = async (__, args) => {
  const service = ResourceService.getInstance();
  const resources = await service.addResource(args.input);

  return resources;
};

const borrowResource: ApiMethod<Resource, MutationBorrowResourceArgs> = async (__, args) => {
  const service = ResourceService.getInstance();
  const resource = await service.getResource(args.input.title, args.input.createdDate);

  if (!resource.available) throw new UserInputError('RESOURCE_UNAVAILABLE');

  const resources = await service.updateResourceDetails({
    ...args.input,
    dateBorrowed: new Date().toISOString()
  });

  return resources;
};

const returnResource: ApiMethod<Resource, MutationReturnResourceArgs> = async (__, args) => {
  const service = ResourceService.getInstance();
  const resources = await service.updateResourceDetails(args.input);

  return resources;
};

const removeResource: ApiMethod<boolean, MutationRemoveResourceArgs> = async (__, args) => {
  const service = ResourceService.getInstance();

  const result = await service.deleteResource(args.input);

  return result;
};

const resolvers: Config['resolvers'] = {
  Query: {
    users: async (parent: unknown, args: unknown, context: Context, info: GraphQLResolveInfo) =>
      privateResolver(parent, args, context, info, users),
    user: async (
      parent: unknown,
      args: QueryUserArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, user),
    resources: async (parent: unknown, args: unknown, context: Context, info: GraphQLResolveInfo) =>
      privateResolver(parent, args, context, info, resources),
    resourcesByUser: async (
      parent: unknown,
      args: QueryResourcesByUserArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, resourcesByUser)
  },
  Mutation: {
    verifyUser: async (__, args: MutationVerifyUserArgs, context: Context) => {
      const service = new UserService(context.firebaseApp);
      const user = await service.getUserByEmail(args.email);

      return Boolean(user);
    },
    addUser: async (
      parent: unknown,
      args: MutationAddUserArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, addUser),
    updateUserInfo: async (
      parent: unknown,
      args: MutationUpdateUserInfoArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, updateUserInfo),
    addResource: async (
      parent: unknown,
      args: unknown,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, addResource),
    borrowResource: async (
      parent: unknown,
      args: MutationBorrowResourceArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, borrowResource),
    returnResource: async (
      parent: unknown,
      args: MutationReturnResourceArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, returnResource),
    removeResource: async (
      parent: unknown,
      args: MutationRemoveResourceArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, removeResource)
  }
};

export default resolvers;
