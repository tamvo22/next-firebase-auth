import firebaseApp from '@/utils/firebase-v9/firebase/initFirebase';
import { getFirestore, QueryDocumentSnapshot, doc, collection } from 'firebase/firestore';

export const firestore = getFirestore(firebaseApp);

const COLLECTIONS = {
  todos: 'todos',
};

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot<T>): T => {
    return snapshot.data()!;
  },
});

// Firestore withConverter for todos
export const Todos = () => collection(firestore, COLLECTIONS.todos).withConverter<Todo>(converter<Todo>());
export const Todo = (id: string) => doc(firestore, COLLECTIONS.todos, id).withConverter<Todo>(converter<Todo>());
 