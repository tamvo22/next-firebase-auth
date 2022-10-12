import { Adapter } from 'next-auth/adapters';
import { addUser, getUser, getUserByEmail, updateUser, deleteUser } from '@/utils/firebase-v9/firebase-admin/firestore/useUsers';
import { getAccount, addAccount, deleteAccountByUserId, deleteAccount } from '@/utils/firebase-v9/firebase-admin/firestore/useAccounts';

export function FirestoreAdapter(): Adapter {
  return {
    async createUser(user) {
      return await addUser(user);
    },
    async getUser(id) {
      const user = await getUser(id);

      return user ? user : null;
    },
    async getUserByEmail(email) {
      const result = await getUserByEmail(email);
      return result;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await getAccount({ provider, providerAccountId });
      if (!account) return null;

      const user = await getUser(account?.userId!);
      return user ? user : null;
    },
    async updateUser(partialUser) {
      const user = await updateUser(partialUser);

      return user!;
    },
    async deleteUser(userId) {
      await deleteUser(userId);
      await deleteAccountByUserId(userId);

      return null;
    },
    async linkAccount(account) {
      await addAccount(account);
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await deleteAccount({ provider, providerAccountId });
    },
    // We utilize jwt so we don't need session in our example
    async createSession(session) {
      return { id: '1', ...session };
    },
    async getSessionAndUser(sessionToken) {
      return null;
    },
    async updateSession(partialSession) {
      return null;
    },
    async deleteSession(sessionToken) {
      return null;
    },
    async createVerificationToken(verificationToken) {
      return null;
    },
    async useVerificationToken({ identifier, token }) {
      return null;
    },
  };
}
