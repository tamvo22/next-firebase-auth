import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Server from '@/utils/com/config';
import { signIn as fbSignIn, getIdToken } from '@/utils/firebase-v9/firebase/useAuth';
import { signIn, getSession, getCsrfToken, getProviders } from 'next-auth/react';
import { UserCredential } from 'firebase/auth';
import { isTypeOf } from '@/utils/helper/typeGuard';
import CredentialForm from '@/com/ui/CredentialForm';
import Provider from '@/com/ui/Provider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const ErrorsList = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  default: 'Unable to sign in.',
};

type ErrorKeys = keyof typeof ErrorsList;

interface SignInType {
  providers: Record<string, any>;
}

const defaultValues = {
  email: 'admin@next-firebase-auth.com',
  password: 'admin2022',
};

function Login({ providers }: SignInType) {
  const [formError, formErrorSet] = useState<string | undefined>();

  const router = useRouter();

  //handle signin errors
  useEffect(() => {
    if (router.query?.error) {
      const error = router.query?.error as ErrorKeys;
      formErrorSet(ErrorsList[error] ?? ErrorsList.default);

      router.push('/login', undefined, { shallow: true });
    }
  }, []);

  const handleSignInProvider = async (event: React.MouseEvent<HTMLButtonElement>, providerId: string) => {
    event.preventDefault();
    // reset error message
    formErrorSet(undefined);

    await signIn(providerId, {
      callbackUrl: `${Server}/dashboard`,
    });
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // reset error message
    event.preventDefault();
    formErrorSet(undefined);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    // send email and password to Firebase for authentication
    const fbAuth = await fbSignIn(email!, password!);

    // Perform type guard for UserCredential type and Error
    if (isTypeOf<UserCredential>(fbAuth, 'user')) {
      // get Firebase authentication userIdToken after a successfull authentication
      const userIdToken = await getIdToken();

      if (userIdToken) {
        const user = JSON.stringify({
          ...fbAuth.user,
          userIdToken: userIdToken,
        });

        // send the return autentication information to NextAuth API for validation and issue a session cookie
        await signIn('firebase-credential', {
          redirect: true,
          auth: user,
          callbackUrl: `${Server}/dashboard`,
        });
      } else {
        // invalid token error
        formErrorSet('Sign in failed');
      }
    } else {
      // set firebase sign in errors
      formErrorSet(fbAuth);
    }
  };

  return (
    <>
      <Typography sx={{ m: '20px' }} variant="h4" component="h1" align="center" gutterBottom>
        Next.js + NextAuth Authentication + Firebase + Firestore
      </Typography>
      <Container maxWidth="sm" sx={{ marginTop: '1rem', marginBottom: '4rem' }}>
        <Grid container spacing={4}>
          <Grid xs={12} sm={12} md={12} item>
            <Typography variant="subtitle1" component="h2" sx={{ color: 'error.main', mb: '20px', display: 'flex', justifyContent: 'center' }}>
              {formError}
            </Typography>
            <CredentialForm defaultValues={defaultValues} handleOnSubmit={handleOnSubmit} />
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <Provider providers={providers} onSignIn={handleSignInProvider} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // redirected to dashboard if user already have a session
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  // initiate csrfToken and provider list
  //const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
