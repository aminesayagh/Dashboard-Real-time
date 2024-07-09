import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { SECRET } from "../env";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
// import EmailProvider from "next-auth/providers/email";

import clientPromise from '../mongodbConnect';
import { generatePageUrl } from "../../app/i18n/settings";

import {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, 
  // EMAIL_FROM, EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD
} from '../env';

const authOptions: NextAuthOptions = {
  callbacks: {
  },
  providers: [
    // https://next-auth.js.org/providers/email
    // EmailProvider({
    //   server: {
    //     host: EMAIL_SERVER_HOST,
    //     port: Number(EMAIL_SERVER_PORT),
    //     auth: {
    //       user: EMAIL_SERVER_USER,
    //       pass: EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: EMAIL_FROM,
    // }),
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
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // basePath: "/api/auth",
  pages: {
    signIn: generatePageUrl('en', "auth.login"), 
    signOut: generatePageUrl('en', "home"), // Redirect to home page after sign out
    newUser: generatePageUrl('en', "auth.profile"),
    verifyRequest: generatePageUrl('en', "auth.verify"),
    error: generatePageUrl('en', "auth.error"),
  }
};

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth(authOptions);