import firebaseApp from '@/utils/firebase-v9/firebase/initFirebase';
import { initializeAuth, inMemoryPersistence, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth';

// disable Firebase persistent session state management
export const fbAuth = initializeAuth(firebaseApp, { persistence: [inMemoryPersistence] });

export const getIdToken = async () => {
  return await fbAuth.currentUser!.getIdToken(true).catch((error) => null);
};

export const signIn = async (email: string, password: string): Promise<UserCredential | string> => {
  return await signInWithEmailAndPassword(fbAuth, email, password).catch((error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Incorrect email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Your account is locked due to too many attempts.';
      default:
        return 'Incorrect username or password';
    }
  });
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(fbAuth, email, password).catch((error) => ({ error: error }));
};

export const signOut = async () => {
  return await fbSignOut(fbAuth).catch((error) => ({ error: error }));
};
