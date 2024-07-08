import { Router } from 'express';
import express from 'express';

export interface Controller {
    path: string;
    router: Router;
    mergeRoute(controller: Controller): void;
    getRouter(): Router;
}

class ManagerController implements Controller {
    public path: string;
    public router: express.Router = express.Router();
    constructor(path: string) {
        this.path = path;
    }
    public mergeRoute(controller: Controller) {
        if (controller instanceof ManagerController) {
            this.router.use(this.path, controller.getRouter());
        } else {
            throw new Error('Invalid controller type');
        }
    }
    public getRouter() {
        this.router.use(this.path, this.router);
        return this.router;
    }
}

export default ManagerController;