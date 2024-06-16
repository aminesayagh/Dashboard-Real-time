import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { SECRET, NEXT_AUTH_URL } from "@utils/env";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './env';
export const authOptions: NextAuthOptions = {
  providers: [
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
  debug: true,
  secret: SECRET,
  jwt: {
    secret: SECRET,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: `${NEXT_AUTH_URL}/auth/login`,
    signOut: `${NEXT_AUTH_URL}/auth/logout`,
    newUser: `${NEXT_AUTH_URL}/auth/profile`,
    verifyRequest: `${NEXT_AUTH_URL}/auth/verify-request`,
    error: `${NEXT_AUTH_URL}/auth/error`,
  }
};
