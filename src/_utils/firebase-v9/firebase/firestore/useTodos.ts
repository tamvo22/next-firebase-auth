import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { onSnapshot, doc, query, setDoc, updateDoc, deleteDoc, where, orderBy } from 'firebase/firestore';
import { queryToObjs } from '@/utils/firebase-v9/firestoreHelper';
import { Todo, Todos } from '@/utils/firebase-v9/firebase/firestore/collections';
import { FirestoreContext } from '@/utils/firebase-v9/firebase/firestore/firestoreContext';

// Client side firestore
export type FBTodo = {
  get(): Promise<Todo[]>;
  add(todo: Omit<Todo, 'id'>): Promise<Todo>;
  update(id: string, todo: Partial<Todo>): Promise<Todo>;
  delete(id: string): Promise<void>;
};
export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const { fsState, setFsState } = useContext(FirestoreContext);

  // pass the session.user.id to the the Todo's uid to distinguish the user's todo
  const { data } = useSession();

  useEffect(() => {
    setLoading(true);
    const q = query(Todos(), where('uid', '==', data?.user.id), orderBy('createAt', 'desc'));
    const todoSubscriber = onSnapshot(q, (querySnapshot) => {
      const res = queryToObjs(querySnapshot);
      setTodos(res);
      setLoading(false);
    });

    // add todoLister to the list of firestore listeners
    setFsState((prev) => ({ ...prev, listeners: [...fsState.listeners, todoSubscriber] }));

    return () => {
      todoSubscriber();
    };
  }, []);

  return {
    todos,
    loading,
    async add(todo: Omit<Todo, 'id' | 'uid'>) {
      const newDocRef = doc(Todos());
      await setDoc(newDocRef, { ...todo, uid: data?.user.id } as Omit<Todo, 'id'>);
    },
    async update(id: string, todo: Partial<Todo>) {
      await updateDoc(Todo(id), todo);
    },
    async delete(id: string) {
      await deleteDoc(Todo(id));
    },
  };
}
