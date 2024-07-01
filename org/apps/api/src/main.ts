import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
import { dbConnect, generateMongoUri } from "./utils/mongooseConnect";
import "express-async-errors";  

import { connectRedis } from "./middlewares/mongooseCache";
const app = ExpressConfig();

const key = generateMongoUri() || '';

connectRedis();

dbConnect(key).then(() => {
    console.log('db connected');
}).catch((error: Error) => {
    console.error('Error connecting to MongoDB.');
    console.error(error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});