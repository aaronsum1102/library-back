import admin from 'firebase-admin';

export type FirebaseApp = admin.app.App;

let app: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
      })
    });
  }

  return app;
};
