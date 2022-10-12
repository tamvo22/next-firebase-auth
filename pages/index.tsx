import Link from '@/com/ui/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Home() {
  return (
    <>
      <Typography sx={{ m: '20px' }} variant="h4" component="h1" align="center" gutterBottom>
        Next.js + NextAuth Authentication + Firebase + Firestore
      </Typography>
      <Container sx={{ marginTop: '1rem', marginBottom: '4rem' }} maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/login" color="secondary">
            Go to the Login page
          </Link>
        </Box>
      </Container>
    </>
  );
}

export default Home;
