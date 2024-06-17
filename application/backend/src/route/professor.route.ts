import express from 'express';
const router = express.Router();
import { ERRORS } from '../constants/ERRORS';
import ProfessorModel, { IProfessorDocument } from '../model/Professor.model';
import { ApiRequest, ApiResponse } from 'types/Api';

router.post('/', async (req: ApiRequest, res: ApiResponse<IProfessorDocument>): Promise<void> => {
    try{
        const Professor = new ProfessorModel(req.body);
        const result = await Professor.save()
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

router.put('/:id', async (req: ApiRequest<Partial<IProfessorDocument>, {}, { id: string }>, res: ApiResponse<IProfessorDocument>) => {
    const { id } = req.params;
    try {
        const result = await ProfessorModel.findByIdAndUpdate(id, req.body, {new: true})
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
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

export default router;