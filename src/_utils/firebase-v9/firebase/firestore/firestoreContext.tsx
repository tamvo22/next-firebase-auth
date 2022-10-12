import { useState, createContext } from 'react';
import { Unsubscribe } from 'firebase/firestore';

type FirestoreState = {
  authenticated: boolean;
  listeners: Unsubscribe[];
};
type FirestoreContext = {
  fsState: FirestoreState;
  setFsState: React.Dispatch<React.SetStateAction<FirestoreState>>;
};

export const FirestoreContext = createContext<FirestoreContext>({
  fsState: {
    authenticated: false, // authenticated state
    listeners: [], // list of listeners to unsubscribe
  },
  setFsState: () => {},
});

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [fsState, setFsState] = useState<FirestoreState>({
    authenticated: false,
    listeners: [],
  });

  return <FirestoreContext.Provider value={{ fsState, setFsState }}>{children}</FirestoreContext.Provider>;
};

export default FirebaseProvider;
