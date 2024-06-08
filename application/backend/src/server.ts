import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
import './utils/mongooseConnect';
const app = ExpressConfig();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});