import { z } from 'zod';

const emvVariables = z.object({
  DASH_PORT: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SECRET: z.string(),
  NEXT_AUTH_URL: z.string(),
  MONGO_URI: z.string(),
  MONGO_DB: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
  BACKEND_URL: z.string(),
});

export type TEnvVariables = z.infer<typeof emvVariables>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TEnvVariables {}
  }
}

const myEnvVariables = emvVariables.parse(process.env);
if (myEnvVariables instanceof Error) throw myEnvVariables;

export const PORT = myEnvVariables.DASH_PORT;
export const GOOGLE_CLIENT_ID = myEnvVariables.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = myEnvVariables.GOOGLE_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = myEnvVariables.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = myEnvVariables.GITHUB_CLIENT_SECRET;
export const SECRET = myEnvVariables.SECRET;
export const NEXT_AUTH_URL = myEnvVariables.NEXT_AUTH_URL;
export const MONGO_URI = myEnvVariables.MONGO_URI;
export const MONGO_DB = myEnvVariables.MONGO_DB;
export const MONGO_USER = myEnvVariables.MONGO_USER;
export const MONGO_PASSWORD = myEnvVariables.MONGO_PASSWORD;
export const ENV = myEnvVariables.NODE_ENV;
export const BACKEND_URL = myEnvVariables.BACKEND_URL;
