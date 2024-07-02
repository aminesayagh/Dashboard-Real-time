import express from 'express';
import { ERRORS } from '../constants/MESSAGE';
import StudentModel, { HydratedStudent } from '../model/Student.model';
import { Student } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { ApiRequest, ApiResponse } from '../types/Api';
const router = express.Router();

type PublicStudent = PublicDoc<HydratedStudent>;

router.post('/', async (req: ApiRequest, res: ApiResponse<PublicStudent>): Promise<void> => {
    try {
        const student = new StudentModel(req.body);
        const result = await student.save();

        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }

        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    } catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

router.put('/:id', async (req: ApiRequest<Partial<Student>, {}, { id: string }>, res: ApiResponse<PublicStudent>) => {
    const { id } = req.params;
    try{
        const result = await StudentModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }
    catch(err:any){
        res.status(400).send({ status: 'error', message: err.message });
    }
});

export default router;