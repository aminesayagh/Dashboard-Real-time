import express from 'express';
import { ERRORS } from '../constants/ERRORS';
import UniversityPeriodModel, { IUniversityPeriodDocument } from '../model/UniversityPeriod.model';
import { ApiRequest, ApiResponse } from 'types/Api';
const router = express.Router();

router.post('/students', async (req: ApiRequest, res: ApiResponse<IUniversityPeriodDocument>): Promise<void> => {
    const universityPeriod = new UniversityPeriodModel(req.body);
    const result = await universityPeriod.save().catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
        return;
    }
    res.send({
        status: 'success',
        data: result
    });
});

router.put('/students/:id', async (req: ApiRequest<Partial<IUniversityPeriodDocument>, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    const result = await UniversityPeriodModel.findByIdAndUpdate(id, req.body).catch((err) => {
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