import express from 'express';
import { ERRORS } from '../constants/ERRORS';
import StudentModel, { IStudentDocument } from '../model/Student.model';
import { ApiRequest, ApiResponse } from 'types/Api';
const router = express.Router();

router.post('/', async (req: ApiRequest, res: ApiResponse<IStudentDocument>): Promise<void> => {
    try {
        const student = new StudentModel(req.body);
        const result = await student.save();

        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }

        res.send({
            status: 'success',
            data: result
        });
    } catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

router.put('/:id', async (req: ApiRequest<Partial<IStudentDocument>, {}, { id: string }>, res: ApiResponse<IStudentDocument>) => {
    const { id } = req.params;
    const result = await StudentModel.findByIdAndUpdate(id, req.body).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

export default router;