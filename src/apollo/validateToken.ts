import admin from 'firebase-admin';

import { getFirebaseApp } from './firebase.js';

export interface Authentication {
  isAuthenticated: boolean;
  message: string;
}

export const validateToken = async (token?: string): Promise<Authentication> => {
  let authentication = {
    isAuthenticated: false,
    message: 'No token provided, skipping validation'
  };

  if (token) {
    const [tokenType, idToken] = token.split(' ');

    const app = getFirebaseApp();
    if (tokenType === 'Bearer' && idToken) {
      try {
        await admin.auth(app).verifyIdToken(idToken);

        authentication = Object.assign(authentication, {
          message: 'Token valid',
          isAuthenticated: true
        });
      } catch (error) {
        authentication = Object.assign({}, authentication, {
          message: error.message || 'Unable to validate token.',
          isAuthenticated: false
        });
      }
    }
  }

  return authentication;
};
