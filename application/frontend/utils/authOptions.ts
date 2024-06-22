import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { SECRET, NEXT_AUTH_URL } from "@utils/env";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import EmailProvider from "next-auth/providers/email";

import clientPromise from '@utils/mongodbConnect';

import {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, EMAIL_FROM,
  EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD
} from './env';
export const authOptions: NextAuthConfig = {
  callbacks: {
    async signIn({ user: _, account, email }) {
      if (!account) {
        return false;
      }
      if (account.provider === 'google' || account.provider === 'github') {
        return true;
      }
      if (account.provider === 'email' && email) {
        // await axios.get('');
        // TODO: send email
        return true;
      }
      return false;
    }
  },
  providers: [
    // https://next-auth.js.org/providers/email
    EmailProvider({
      server: {
        host: EMAIL_SERVER_HOST,
        port: EMAIL_SERVER_PORT,
        auth: {
          user: EMAIL_SERVER_USER,
          pass: EMAIL_SERVER_PASSWORD,
        },
      },
      from: EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise().then()),
  debug: true,
  secret: SECRET,
  jwt: {
    secret: SECRET,
  } as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  basePath: "/api/auth",
  pages: {
    signIn: `${NEXT_AUTH_URL}/auth/login`,
    signOut: `${NEXT_AUTH_URL}/auth/logout`,
    newUser: `${NEXT_AUTH_URL}/auth/profile`,
    verifyRequest: `${NEXT_AUTH_URL}/auth/verify-request`,
    error: `${NEXT_AUTH_URL}/auth/error`,
  }
};
