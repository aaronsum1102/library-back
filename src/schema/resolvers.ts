import { Config, AuthenticationError } from 'apollo-server-micro';
import { GraphQLResolveInfo } from 'graphql';

import { Context } from '../apollo';
import { UserService } from '../service';
import {
  QueryUserArgs,
  MutationVerifyUserArgs,
  ResolverFn,
  MutationAddUserArgs,
  MutationUpdateUserInfoArgs
} from '../generated/graphql';
import { auth } from 'firebase-admin';

const privateResolver = <TResult, TArgs>(
  parent: unknown,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo,
  resolver: ResolverFn<TResult, unknown, Context, TArgs>
): Promise<TResult> | TResult => {
  if (!context.authentication.isAuthenticated) {
    throw new AuthenticationError(context.authentication.message);
  }

  return resolver(parent, args, context, info);
};

const user: ResolverFn<auth.UserRecord, unknown, Context, QueryUserArgs> = async (
  __,
  args,
  context
) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.getUserByEmail(args.email);

  return user;
};

const addUser: ResolverFn<auth.UserRecord, unknown, Context, MutationAddUserArgs> = async (
  __,
  args,
  context
) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.addUser(args.input);

  return user;
};

const updateUserInfo: ResolverFn<auth.UserRecord, unknown, Context, MutationUpdateUserInfoArgs> =
  async (__, args, context) => {
    const service = new UserService(context.firebaseApp);
    const user = await service.updateUserInfo(args.input);

    return user;
  };

const resolvers: Config['resolvers'] = {
  Query: {
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
