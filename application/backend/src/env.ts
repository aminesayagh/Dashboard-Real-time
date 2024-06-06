import { z } from 'zod';

const envVariables = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    MONGO_URI: z.string(),
    MONGO_DB: z.string(),
    USER_MAILER_USER: z.string(),
    USER_MAILER_PASSWORD: z.string(),
});

const myEnvVariables = envVariables.parse(process.env);

export type TEnvVariables = z.infer<typeof envVariables>;   

declare global {
    namespace NodeJS {
        interface ProcessEnv extends TEnvVariables {
        }
    }
}

process.env.NODE_ENV !== "production" ? import("dotenv").then(d => d.config({
    path: ".dev.env"
})) : null;

export const PORT = myEnvVariables.PORT;
export const NODE_ENV = myEnvVariables.NODE_ENV;
export const MONGO_URI = myEnvVariables.MONGO_URI;
export const MONGO_DB = myEnvVariables.MONGO_DB;
export const USER_MAILER_USER = myEnvVariables.USER_MAILER_USER;
export const USER_MAILER_PASSWORD = myEnvVariables.USER_MAILER_PASSWORD;