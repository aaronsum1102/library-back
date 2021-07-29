import { ApolloServer, Config } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { getFirebaseApp, FirebaseApp } from './firebase';
import { validateToken, Authentication } from './validateToken';

let server: ApolloServer | null = null;
const API_PATH = '/api';

export interface Context {
  headers: VercelRequest['headers'];
  firebaseApp: FirebaseApp;
  authentication: Authentication;
}

export const createGraphqlServer = async ({
  typeDefs,
  resolvers
}: Pick<Config, 'typeDefs' | 'resolvers'>): Promise<ApolloServer> => {
  if (server) return server;

  server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      firebaseApp: getFirebaseApp()
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
  });

  await server.start();

  return server;
};

export const enrichContext = async (
  server: ApolloServer,
  request: VercelRequest
): Promise<void> => {
  const authentication = await validateToken(request.headers.authorization);

  server.requestOptions = {
    context: {
      ...server.requestOptions,
      headers: request.headers,
      authentication: authentication
    }
  };
};

export const createGraphqlHandler = (
  server: ApolloServer,
  request: VercelRequest,
  response: VercelResponse
): void => {
  const handler = server.createHandler({
    path: API_PATH
  });

  handler(request, response);
};
