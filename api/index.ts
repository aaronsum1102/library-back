import { VercelApiHandler } from '@vercel/node';
import 'ts-tiny-invariant';

import { typeDefs, resolvers } from '../src/schema';
import { createGraphqlServer, enrichContext, createGraphqlHandler } from '../src/apollo';

const handler: VercelApiHandler = async (request, response) => {
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (request.method === 'OPTIONS') {
    response.end();
    return;
  }

  const server = await createGraphqlServer({
    typeDefs,
    resolvers
  });

  enrichContext(server, request);
  createGraphqlHandler(server, request, response);
};

export default handler;
