import { Config, AuthenticationError } from 'apollo-server-micro';
import { GraphQLResolveInfo } from 'graphql';

import { Context } from '../apollo';
import { UserService } from '../service';
import {
  User,
  QueryUserArgs,
  MutationVerifyUserArgs,
  MutationAddUserArgs,
  MutationUpdateUserInfoArgs
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

const resolvers: Config['resolvers'] = {
  Query: {
    users: async (parent: unknown, args: unknown, context: Context, info: GraphQLResolveInfo) =>
      privateResolver(parent, args, context, info, users),
    user: async (
      parent: unknown,
      args: QueryUserArgs,
      context: Context,
      info: GraphQLResolveInfo
    ) => privateResolver(parent, args, context, info, user)
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
    ) => privateResolver(parent, args, context, info, updateUserInfo)
  }
};

export default resolvers;
