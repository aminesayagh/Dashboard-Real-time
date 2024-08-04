import express from 'express';
import { ERRORS } from '../constants/MESSAGE';
import ProfessorModel, { HydratedProfessor } from '../model/Professor.model';
import { ApiRequest, ApiResponse } from 'types/Api';
import { Professor } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';

const router = express.Router();
type PublicProfessor = PublicDoc<HydratedProfessor>;   

router.post('/', async (req: ApiRequest, res: ApiResponse<PublicProfessor>): Promise<void> => {
    try{
        const Professor = new ProfessorModel(req.body);
        const result = await Professor.save()
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

router.put('/:id', async (req: ApiRequest<Partial<Professor>, {}, { id: string }>, res: ApiResponse<PublicProfessor>) => {
    const { id } = req.params;
    try {
        const result = await ProfessorModel.findByIdAndUpdate(id, req.body, {new: true})
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
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

export default router;