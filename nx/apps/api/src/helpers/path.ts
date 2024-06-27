import { Express } from 'express';


interface Route {
    method: string;
    path: string;
}


export const getRoutes = (app: Express): Route[] => {
    const routes: Route[] = [];

    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) { // routes registered directly on the app
            const methods = Object.keys(middleware.route.methods);
            console.log(middleware.route.methods);
            if (!methods || methods.length === 0) {
                return;
            }
            methods.forEach((method) => {
                routes.push({
                    method: method.toUpperCase(),
                    path: middleware.route?.path
                });
            });
        } else if (middleware.name === 'router') { // router middleware
            middleware.handle.stack.forEach((handler: any) => {
                const methods = Object.keys(handler.route.methods);
                methods.forEach((method) => {
                    routes.push({
                        method: method.toUpperCase(),
                        path: `${middleware.regexp.source}${handler.route.path}`
                    });
                });
            });
        }
    });

    return routes;
}

export const generateTypeString = (routes: Route[]): string => {
    return routes
      .map(route => `'${route.method.toUpperCase()} ${route.path}'`)
      .join(' | ');
  };