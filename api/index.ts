import { VercelApiHandler } from '@vercel/node';

import { typeDefs, resolvers } from '../src/schema';
import {
  createGraphqlServer,
  enrichContext,
  createGraphqlHandler,
  defineCORSHeaders
} from '../src/apollo';

const allowedOrigins = ['library-front.vercel.app', 'library-front-dev.vercel.app'];

process.env.IS_LOCAL && allowedOrigins.push('localhost');

const handler: VercelApiHandler = async (request, response) => {
  const headers = defineCORSHeaders(request.headers.origin, { origin: allowedOrigins });
  Object.keys(headers).forEach((key) => response.setHeader(key, headers[key]));

  if (request.method === 'OPTIONS') {
    response.end();
    return;
  }

  const server = await createGraphqlServer({
    typeDefs,
    resolvers
  });

  await enrichContext(server, request);
  createGraphqlHandler(server, request, response);
};

export default handler;
