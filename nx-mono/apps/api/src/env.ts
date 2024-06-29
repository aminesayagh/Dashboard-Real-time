import { z } from 'zod';

const envVariables = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    MONGO_URI: z.string(),
    MONGO_TEST_DB: z.string(),
    MONGO_ATLAS: z.string(),
    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),
    USER_MAILER_USER: z.string(),
    USER_MAILER_PASSWORD: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    REDIS_URI: z.string().default("redis://localhost:6379"),
});


export type TEnvVariables = z.infer<typeof envVariables>;   

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv extends TEnvVariables {
            PORT: string;
            NODE_ENV: 'development' | 'production' | 'test';
            MONGO_URI: string;
            MONGO_TEST_DB: string;
            MONGO_ATLAS: string;
            MONGO_USER: string;
            MONGO_PASSWORD: string;
            USER_MAILER_USER: string;
            USER_MAILER_PASSWORD: string;
            CLOUDINARY_CLOUD_NAME: string;
            CLOUDINARY_API_KEY: string;
            CLOUDINARY_API_SECRET: string;
            REDIS_URI: string;
        }
    }
}

import { config } from 'dotenv';
config();


const myEnvVariables = envVariables.parse(process.env);

export const PORT = myEnvVariables.PORT;
export const NODE_ENV = myEnvVariables.NODE_ENV;
export const MONGO_URI = myEnvVariables.MONGO_URI;
export const MONGO_TEST_DB = myEnvVariables.MONGO_TEST_DB;
export const MONGO_ATLAS = myEnvVariables.MONGO_ATLAS;
export const MONGO_USER = myEnvVariables.MONGO_USER;
export const MONGO_PASSWORD = myEnvVariables.MONGO_PASSWORD
export const USER_MAILER_USER = myEnvVariables.USER_MAILER_USER;
export const USER_MAILER_PASSWORD = myEnvVariables.USER_MAILER_PASSWORD;
export const CLOUDINARY_CLOUD_NAME = myEnvVariables.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = myEnvVariables.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = myEnvVariables.CLOUDINARY_API_SECRET;
export const REDIS_URI = myEnvVariables.REDIS_URI;