import { ApolloServer, Config } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirebaseApp, FirebaseApp } from './firebase';

let server: ApolloServer | null = null;
const API_PATH = '/api';

export interface Context {
  headers: VercelRequest['headers'];
  firebaseApp: FirebaseApp;
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

export const enrichContext = (server: ApolloServer, request: VercelRequest): void => {
  server.requestOptions = {
    context: {
      ...server.requestOptions,
      headers: request.headers
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
