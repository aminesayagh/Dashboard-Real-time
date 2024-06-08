import { z } from 'zod';

const envVariables = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    MONGO_URI: z.string(),
    MONGO_DB: z.string(),
    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),
    USER_MAILER_USER: z.string(),
    USER_MAILER_PASSWORD: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
});


export type TEnvVariables = z.infer<typeof envVariables>;   

declare global {
    namespace NodeJS {
        interface ProcessEnv extends TEnvVariables {
        }
    }
}

import { config } from 'dotenv';
config();


const myEnvVariables = envVariables.parse(process.env);

export const PORT = myEnvVariables.PORT;
export const NODE_ENV = myEnvVariables.NODE_ENV;
export const MONGO_URI = myEnvVariables.MONGO_URI;
export const MONGO_DB = myEnvVariables.MONGO_DB;
export const MONGO_USER = myEnvVariables.MONGO_USER;
export const MONGO_PASSWORD = myEnvVariables.MONGO_PASSWORD;
export const USER_MAILER_USER = myEnvVariables.USER_MAILER_USER;
export const USER_MAILER_PASSWORD = myEnvVariables.USER_MAILER_PASSWORD;
export const CLOUDINARY_CLOUD_NAME = myEnvVariables.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = myEnvVariables.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = myEnvVariables.CLOUDINARY_API_SECRET;