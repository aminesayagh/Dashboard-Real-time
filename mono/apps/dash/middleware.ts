import { chain } from './src/middlewares/chain';
import { middlewareI18n } from './src/middlewares/i18n';

export default chain([
    middlewareI18n
]);

export const config = {
    // matcher: '/:lng*'
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}