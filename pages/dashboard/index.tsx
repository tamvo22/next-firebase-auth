import { useContext } from 'react';
import Container from '@mui/material/Container';
import TodoList from '@/com/ui/TodoList';
import Typography from '@mui/material/Typography';
import { FirestoreContext } from '@/utils/firebase-v9/firebase/firestore/firestoreContext';

function Dashboard() {
  const { fsState } = useContext(FirestoreContext);

  return (
    <Container maxWidth={'sm'}>
      <Typography sx={{ m: '20px' }} variant="h5" component="h2" align="center">
        Welcome to Admin Dashboard Todo List
      </Typography>
      {fsState.authenticated && <TodoList />}
    </Container>
  );
}

export default Dashboard;
