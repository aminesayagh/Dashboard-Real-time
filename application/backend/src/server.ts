import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
import apiRoutes from './route/api';
console.log(PORT);
const app = ExpressConfig();

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});