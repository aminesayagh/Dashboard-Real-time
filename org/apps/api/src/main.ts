import App from './app';
import { PORT } from './env';

const app = App.create(
    [
        
    ],
    Number(PORT)
);

app.listen();