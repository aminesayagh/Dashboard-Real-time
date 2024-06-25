import { chain } from '@/middlewares/chain';
import { middlewareI18n } from '@/middlewares/i18n';

export default chain([
    middlewareI18n
]);

export const config = {
    // matcher: '/:lng*'
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
  }