// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion } from "mongodb";
import type { MongoClientOptions } from "mongodb";

import { MONGODB_URI, ENV } from "./env";
const uri = MONGODB_URI || "";
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
}

let client;

if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
}

async function run() {
    let clientPromise: MongoClient;
    if (ENV === "development") {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        // @ts-ignore
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options as MongoClientOptions);
            // @ts-ignore
            global._mongoClientPromise = client.connect();
        }
        // @ts-ignore
        clientPromise = global._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, options as MongoClientOptions);
        clientPromise = await client.connect();
    }
    return clientPromise;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default run;