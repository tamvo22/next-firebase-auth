import { docToObj, querySingleToObj } from '@/utils/firebase-v9/firestoreHelper';
import { AdapterUser, Users } from '@/utils/firebase-v9/firebase-admin/firestore/collections';

export const addUser = async (user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> => {
  const { id } = await Users.add(user as any);
  return { ...user, id } as AdapterUser;
};

export const getUser = async (id: string): Promise<AdapterUser | null> => {
  return await Users.doc(id)
    .get()
    .then((doc) => docToObj(doc));
};

export const getUserByEmail = async (email: string) => {
  const ref = Users.where('email', '==', email).limit(1);
  return await ref.get().then((query) => querySingleToObj(query));
};

export const updateUser = async (user: Partial<AdapterUser>) => {
  const { id, ...data } = user;
  await Users.doc(id!).update(data as {});
  return await Users.doc(id!)
    .get()
    .then((doc) => docToObj(doc));
};

export const deleteUser = async (id: string) => {
  await Users.doc(id!).delete();
};
