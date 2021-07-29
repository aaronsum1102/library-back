import { auth } from 'firebase-admin';

import { getFirebaseApp } from './firebase';

export interface Authentication {
  isAuthenticated: boolean;
  message: string;
}

export const validateToken = async (token: string): Promise<Authentication> => {
  const app = getFirebaseApp();

  let authentication = {
    isAuthenticated: false,
    message: 'No token provided, skipping validation'
  };

  if (token) {
    try {
      await auth(app).verifyIdToken(token);

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

  return authentication;
};
