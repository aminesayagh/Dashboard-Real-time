import ExpressConfig from "./express/express.config";
import { dbConnect } from "./utils/mongooseConnect";
import { MONGO_URI, PORT } from "./env";
const app = ExpressConfig();

dbConnect(MONGO_URI).then(() => {
    console.log('db connected');
}).catch((error: Error) => {
    console.log('Error connecting to MongoDB.');
    console.log(error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});