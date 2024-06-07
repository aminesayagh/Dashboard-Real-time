import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
console.log(PORT);
const app = ExpressConfig();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});