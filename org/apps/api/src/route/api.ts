
import User from './user.route';
import Resource from './resource.route';
import Student from './student.route';
import Professor from './professor.route';
import Department from './department.route';
import Taxonomy from './taxonomy.route';
import University_period from './university_period.route';

import ManagerController from '../helpers/Controller';



export default class MainController extends ManagerController {
    constructor() {
        super('/api/v1');  
        this.initRoutes();
    }
    private initRoutes() {
        // use this.path to prefix all routes, and this.router to define routes
        this.router.use(`${this.path}/check`, (_, res) => {
            res.json('Server is running');
        });
        this.mergeRoute(new User());
        this.mergeRoute(new Student);
        this.mergeRoute(new Professor);
        this.mergeRoute(new Department);
        this.mergeRoute(new Taxonomy);
        this.mergeRoute(new University_period);
        this.mergeRoute(new Resource);
    }
}
