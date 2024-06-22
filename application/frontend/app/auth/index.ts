import NextAuth from "next-auth";
export const BASE_PATH = "/api/auth";
import { authOptions } from 'utils/authOptions';

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
