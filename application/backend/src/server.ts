import ExpressConfig from "./express/express.config";
import { PORT } from "./env";
const app = ExpressConfig();
import apiRoutes from './route/api';

app.use('/api', apiRoutes);
app.get('/check', (_, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});