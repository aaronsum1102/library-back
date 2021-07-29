import { Config, AuthenticationError } from 'apollo-server-micro';
import { GraphQLResolveInfo } from 'graphql';

import { Context } from '../apollo';
import { UserService } from '../service';
import { QueryUserArgs, MutationVerifyUserArgs, ResolverFn } from '../generated/graphql';
import { auth } from 'firebase-admin';

const privateResolver = <TResult, TArgs>(
  parent: any,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo,
  resolver: ResolverFn<TResult, any, Context, TArgs>
): Promise<TResult> | TResult => {
  if (!context.authentication.isAuthenticated) {
    throw new AuthenticationError(context.authentication.message);
  }

  return resolver(parent, args, context, info);
};

const user: ResolverFn<auth.UserRecord, any, Context, QueryUserArgs> = async (
  __,
  args,
  context
) => {
  const service = new UserService(context.firebaseApp);
  const user = await service.getUserByEmail(args.email);

  return user;
};

const resolvers: Config['resolvers'] = {
  Query: {
    user: async (parent: any, args: QueryUserArgs, context: Context, info: GraphQLResolveInfo) =>
      privateResolver(parent, args, context, info, user)
  },
  Mutation: {
    verifyUser: async (__, args: MutationVerifyUserArgs, context: Context) => {
      const service = new UserService(context.firebaseApp);
      const user = await service.getUserByEmail(args.email);

      return Boolean(user);
    }
  }
};

export default resolvers;
