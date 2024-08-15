import { PORT } from './env';
import App from './app';
import MainController from './route/api';

const app = App.create(new MainController(), Number(PORT));

app.listen();
