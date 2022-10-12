import { Account as AdapterAccount } from 'next-auth';
import { AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';
import firebaseAdminApp from '@/utils/firebase-v9/firebase-admin/initFirebaseAdmin';
import { getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const firestoreAdmin = getFirestore(firebaseAdminApp);

const COLLECTIONS = {
  users: 'users',
  sessions: 'sessions',
  accounts: 'accounts',
  verificationTokens: 'verificationTokens',
};

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<T>): T => {
    return snapshot.data();
  },
});

// re-export types
export type { AdapterAccount, AdapterSession, AdapterUser, VerificationToken };

// Firestore withConverter for firestoreAdapter
export const Accounts = firestoreAdmin.collection(COLLECTIONS.accounts).withConverter<AdapterAccount>(converter<AdapterAccount>());
export const Sessions = firestoreAdmin.collection(COLLECTIONS.sessions).withConverter<AdapterSession>(converter<AdapterSession>());
export const Users = firestoreAdmin.collection(COLLECTIONS.users).withConverter<AdapterUser>(converter<AdapterUser>());
export const VerificationTokens = firestoreAdmin.collection(COLLECTIONS.verificationTokens).withConverter<VerificationToken>(converter<VerificationToken>());
