import { Config } from 'apollo-server-micro';

import { Context } from '../apollo';
import { UserService } from '../service';
import { QueryUserArgs, MutationVerifyUserArgs } from '../generated/graphql';

const resolvers: Config['resolvers'] = {
  Query: {
    user: async (__, args: QueryUserArgs, context: Context) => {
      const service = new UserService(context.firebaseApp);
      const user = await service.getUserByEmail(args.email);

      return user;
    }
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
