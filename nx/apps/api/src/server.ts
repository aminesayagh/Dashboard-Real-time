import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
import { dbConnect, generateMongoUri } from "./utils/mongooseConnect";
import { connectRedis } from "./utils/mongooseCache";
const app = ExpressConfig();

const key = generateMongoUri() || '';

connectRedis();

dbConnect(key).then(() => {
    console.log('db connected');
}).catch((error: Error) => {
    console.log('Error connecting to MongoDB.');
    console.log(error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});