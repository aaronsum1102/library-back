import { Config } from 'apollo-server-micro';
import { QueryUserArgs } from '../generated/graphql';
import { Context } from '../apollo';
import { UserService } from '../service';

const resolvers: Config['resolvers'] = {
  Query: {
    user: async (__, args: QueryUserArgs, context: Context) => {
      const service = new UserService(context.firebaseApp);
      return service.getUserByEmail(args.email);
    }
  }
};

export default resolvers;
