import { getAuth } from 'firebase-admin/auth';
import firebaseAdmin from '@/utils/firebase-v9/firebase-admin/initFirebaseAdmin';

export const adminAuth = getAuth(firebaseAdmin);

export async function verifyIdToken(idToken: string) {
  let checkRevoked = true;
  return await adminAuth
    .verifyIdToken(idToken, checkRevoked)
    .then((decodedToken) => {
      return decodedToken;
    })
    .catch((error) => {
      return error;
    });
}
