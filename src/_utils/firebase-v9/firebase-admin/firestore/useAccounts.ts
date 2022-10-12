import { querySingleToObj } from '@/utils/firebase-v9/firestoreHelper';
import { firestoreAdmin, AdapterAccount, Accounts } from '@/utils/firebase-v9/firebase-admin/firestore/collections';

export const addAccount = async (account: AdapterAccount) => {
  const { id } = await Accounts.add(account);
  return { ...account, id } as AdapterAccount;
};

export const getAccount = async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
  const ref = Accounts.where('provider', '==', provider).where('providerAccountId', '==', providerAccountId).limit(1);
  return await ref.get().then((query) => querySingleToObj(query));
};

export const deleteAccount = async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
  const ref = Accounts.where('provider', '==', provider).where('providerAccountId', '==', providerAccountId).limit(1);
  const accountDocs = await ref.get();

  if (accountDocs.empty) return;
  await firestoreAdmin.runTransaction(async (transaction) => {
    transaction.delete(accountDocs.docs[0]?.ref!);
  });
};

export const deleteAccountByUserId = async (userId: string) => {
  const ref = Accounts.where('userId', '==', userId);
  const accountDocs = await ref.get();

  if (accountDocs.empty) return;
  await firestoreAdmin.runTransaction(async (transaction) => {
    accountDocs.forEach((account) => transaction.delete(account.ref));
  });
};
