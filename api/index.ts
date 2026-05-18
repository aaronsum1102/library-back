import { VercelApiHandler } from '@vercel/node';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { typeDefs, resolvers } from '../src/schema';
import {
  createGraphqlServer,
  defineCORSHeaders,
  getFirebaseApp,
  validateToken
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

  const apolloHandler = startServerAndCreateNextHandler(server, {
    context: async (req) => {
      const authentication = await validateToken(req.headers.authorization);
      return {
        headers: req.headers,
        firebaseApp: getFirebaseApp(),
        authentication
      };
    }
  });

  await apolloHandler(request, response);
};

export default handler;
