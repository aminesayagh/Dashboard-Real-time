import expressConfig from "./express/express.config";
import { PORT } from "./env";
console.log(PORT);
const app = expressConfig();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});