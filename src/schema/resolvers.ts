import { Config } from 'apollo-server-micro';

const products = [
  {
    id: 1,
    name: 'Cookie',
    price: 300
  },
  {
    id: 2,
    name: 'Brownie',
    price: 350
  }
];

const resolvers: Config['resolvers'] = {
  Query: {
    products: (parent, args, context, info) => {
      return products;
    }
  }
};

export default resolvers;
