import { ApolloServer, gql } from 'apollo-server-micro';
import { VercelApiHandler } from '@vercel/node';

// This data will be returned by our test endpoint
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

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Product {
    id: Int
    name: String
    price: Int
  }

  type Query {
    products: [Product]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    products: () => {
      return products;
    }
  }
};

const config = {
  api: {
    bodyParser: false
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler: VercelApiHandler = async (request, response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (request.method === 'OPTIONS') {
    response.end();
    return false;
  }

  await server.start();

  server.createHandler({
    path: '/api/graphql'
  })(request, response);
};

export default handler;
