import { AppOptions, cert, getApp, getApps, ServiceAccount } from 'firebase-admin/app';

import admin from 'firebase-admin';

const FirebaseAdminPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const FirebaseProjectID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_DATABASE_URL = 'https://' + FirebaseProjectID + '.firebaseio.com';

const credentials: ServiceAccount = {
  projectId: FirebaseProjectID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: FirebaseAdminPrivateKey?.replace(/\\n/g, '\n'),
};

const serviceAccount: AppOptions = {
  credential: cert(credentials),
  databaseURL: FIREBASE_DATABASE_URL,
};

const firebaseAdminApp =
  getApps().length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    : getApp();
export default firebaseAdminApp;
