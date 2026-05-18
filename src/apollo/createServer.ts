import { ApolloServer, ApolloServerOptions } from '@apollo/server';
import { VercelRequest } from '@vercel/node';

import { FirebaseApp } from './firebase.js';
import { Authentication } from './validateToken.js';

let server: ApolloServer<Context> | null = null;

export interface Context {
  headers: VercelRequest['headers'];
  firebaseApp: FirebaseApp;
  authentication: Authentication;
}

export const createGraphqlServer = async ({
  typeDefs,
  resolvers
}: Pick<ApolloServerOptions<Context>, 'typeDefs' | 'resolvers'>): Promise<
  ApolloServer<Context>
> => {
  if (server) return server;

  server = new ApolloServer<Context>({
    typeDefs,
    resolvers
  });

  await server.start();

  return server;
};
