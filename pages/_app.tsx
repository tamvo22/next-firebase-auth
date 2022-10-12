import Head from 'next/head';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import FirestoreContext from '@/utils/firebase-v9/firebase/firestore/firestoreContext';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import MuiThemeProvider from '@/com/themes/MuiThemeProvider';
import '@/styles/global.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps<{
  session?: Session;
}> & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={pageProps?.session}>
        <FirestoreContext>
          <MuiThemeProvider Component={Component}>
            <Component {...pageProps} />
          </MuiThemeProvider>
        </FirestoreContext>
      </SessionProvider>
    </CacheProvider>
  );
}
