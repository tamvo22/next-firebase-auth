import { useEffect, useContext } from 'react';
import server from '@/utils/com/config';
import { useSession, signOut } from 'next-auth/react';
import { signInWithCustomToken, signOut as fsSignOut } from 'firebase/auth';
import { FirestoreContext } from '@/utils/firebase-v9/firebase/firestore/firestoreContext';
import { fbAuth } from '@/utils/firebase-v9/firebase/useAuth';
import { Session } from 'next-auth';
import Header from './header';
import Footer from './footer';
import { Container, Main, Logo, List, Link, ListItemButton, ListItemText } from './styled';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface Layout {
  children: React.ReactNode;
}

const DefaultHeader = () => (
  <List>
    <Link href="/">
      <ListItem>
        <ListItemButton>
          <ListItemText>Home</ListItemText>
        </ListItemButton>
      </ListItem>
    </Link>
    <Link href="/login">
      <ListItem>
        <ListItemButton>
          <ListItemText>Login</ListItemText>
        </ListItemButton>
      </ListItem>
    </Link>
  </List>
);

const AdminHeader = ({ session }: { session: Session }) => {
  // update firestore state
  const { fsState, setFsState } = useContext(FirestoreContext);

  useEffect(() => {
    if (session) {
      // authenticate with firestore for access to resource
      signInWithCustomToken(fbAuth, session?.user?.accessToken).then(() => {
        // save firestore authenticated state
        setFsState((prev) => ({ ...prev, authenticated: true }));
      });
    }
  }, [session]);

  function handleSignOut() {
    signOut({ callbackUrl: server + '/login' });

    // remove all active listeners, reset firestore state and logout of firestore
    fsState.listeners.forEach((subscriber) => subscriber());
    setFsState({ authenticated: false, listeners: [] });

    //logout of firestore
    fsSignOut(fbAuth);
  }

  return (
    <List>
      <Link href="/login">
        <ListItem>
          <ListItemButton onClick={handleSignOut}>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );
};

export default function Layout({ children }: Layout) {
  // check for session
  const session = useSession();

  console.log('session', session);

  if (session.status === 'loading') return null;

  return (
    <Container maxWidth={false} disableGutters>
      {session.status === 'authenticated' ? (
        <Header
          title={
            <Typography color="common.white" noWrap>
              Dashboard
            </Typography>
          }>
          <AdminHeader session={session.data} />
        </Header>
      ) : (
        <Header title={<Logo>My Logo</Logo>}>
          <DefaultHeader />
        </Header>
      )}
      <Main id="main" role="main">
        {children}
      </Main>
      <Footer />
    </Container>
  );
}
