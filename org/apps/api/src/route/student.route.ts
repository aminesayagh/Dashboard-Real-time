import { NextFunction } from 'express';
import { ERRORS } from '../constants/MESSAGE';
import StudentModel, { HydratedStudent } from '../model/Student.model';
import { Student } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { ApiRequest, ApiResponse } from '../types/Api';
import { Types } from 'mongoose';
import { idQuery } from '../middlewares/query';
import ManagerController from '../helpers/Controller';

type PublicStudent = PublicDoc<HydratedStudent>;

export default class StudentController extends ManagerController {
    constructor() {
        super('/students');
        this.initRoutes();
    }
    private initRoutes() {
        this.router.post('/', this.create);
        this.router.put('/:id', idQuery(), this.update);
    }
    private create = async (req: ApiRequest, res: ApiResponse<PublicStudent>, next: NextFunction): Promise<void> => {
        const student = new StudentModel(req.body);
        student.save().then((result) => {
            if (!result) {
                next({ message: ERRORS.BAD_REQUEST });
                return;
            }
            res.status(200).json({ status: 'success', data: toPublicDoc(result) });
        }).catch((err: Error) => {
            next({ message: err.message || ERRORS.BAD_REQUEST });
        });
    }
    private update = async (req: ApiRequest<Partial<Student> & { id: Types.ObjectId }>, res: ApiResponse<PublicStudent>, next: NextFunction) => {
        const { id, ...bodyStudent } = req.body;
        StudentModel.findByIdAndUpdate(id, bodyStudent, { new: true }).then((result) => {
            if (!result) {
                next({ message: ERRORS.NOT_FOUND });
                return;
            }
            res.status(200).json({ status: 'success', data: toPublicDoc(result) });
        }).catch((err: Error) => {
            next({ message: err.message || ERRORS.BAD_REQUEST });
        });
    }
}