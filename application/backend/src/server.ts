import ExpressConfig from "./express/express.config";
import { MONGO_USER, MONGO_PASSWORD, MONGO_URI, MONGO_DB, PORT } from "./env";
import { dbConnect, generateMongoUri } from "./utils/mongooseConnect";
const app = ExpressConfig();

const key = generateMongoUri(MONGO_USER, MONGO_PASSWORD, MONGO_URI, MONGO_DB) || '';

dbConnect(key).then(() => {
    console.log('db connected');
}).catch((error: any) => {
    console.log('Error connecting to MongoDB.');
    console.log(error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});