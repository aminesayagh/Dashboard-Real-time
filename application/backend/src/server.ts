import expressConfig from "./express/express.config";
import { PORT } from "./env";

const app = expressConfig();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});