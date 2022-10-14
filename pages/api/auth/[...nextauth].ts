import NextAuth, { User } from 'next-auth';
import { adminAuth, verifyIdToken } from '@/utils/firebase-v9/firebase-admin/useAuth';
import { FirestoreAdapter } from '@/utils/auth/firestoreAdapter';
import { getUser } from '@/utils/firebase-v9/firebase-admin/firestore/useUsers';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

// https://next-auth.js.org/configuration/options
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'firebase-credential',
      name: 'Credentials',
      credentials: {
        auth: { label: 'auth', type: 'text' },
      },
      async authorize(credentials, req) {
        const authUser = JSON.parse(credentials?.auth!);

        //Verify firebase access_token with verifyIdToken
        const isValidUser = await verifyIdToken(authUser.userIdToken);

        if (isValidUser) {
          // fetch user database profile such as name and role to add to our user token
          const profile = await getUser(isValidUser.uid);

          const user: User = {
            id: authUser.uid,
            name: profile?.name!,
            role: profile?.role!,
            email: authUser.email,
            image: authUser.image,
            emailVerified: authUser.emailVerified,
          };

          return user;
        } else {
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // @ts-ignore
      scope: 'read:user',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name ?? profile.login,
          email: profile.email!,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  adapter: FirestoreAdapter(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const uid = user.id || token.sub;
        // create firestore accessToken
        const accessToken = await adminAuth.createCustomToken(uid);
        token.user = { ...user, accessToken };
      }

      return token;
    },
    async session({ session, token }) {
      session = { ...session, ...token };

      return session;
    },
  },
  theme: {
    colorScheme: 'light',
  },
  debug: false,
});
