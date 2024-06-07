import express from 'express';
import { ERRORS } from 'constants/ERRORS';
import UniversityPeriodModel, { IUniversityPeriodDocument } from 'src/model/UniversityPeriod.model';
import { ApiRequest, ApiResponse, ApiResponsePagination } from 'types/Api';
import qs from 'qs';
const router = express.Router();


router.get('/', async (req: ApiRequest, res: ApiResponsePagination<IUniversityPeriodDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await UniversityPeriodModel.paginate(filter, options).catch((err) => {
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

router.post('/', async (req: ApiRequest, res: ApiResponse<IUniversityPeriodDocument>): Promise<void> => {
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

router.get('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    const result = await UniversityPeriodModel.findById(id).catch((err) => {
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
router.put('/:id', async (req: ApiRequest<Partial<IUniversityPeriodDocument>, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
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
router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    const result = await UniversityPeriodModel.findByIdAndDelete(id).catch((err) => {
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
router.get('/:id/next', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    const result = await UniversityPeriodModel.findById(id).populate('next').catch((err) => {
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
router.get('/:id/previous', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    const result = await UniversityPeriodModel.findById(id).populate('previous').catch((err) => {
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
router.get('/current', async (_: ApiRequest, res: ApiResponse<IUniversityPeriodDocument>) => {
    const result = await UniversityPeriodModel.findOne({ period_date_start: { $lte: new Date() }, period_date_end: { $gte: new Date() } }).catch((err) => {
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
router.put('/current', async (req: ApiRequest<Partial<IUniversityPeriodDocument>>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const currentPeriod = await UniversityPeriodModel.findOne({ period_date_start: { $lte: new Date() }, period_date_end: { $gte: new Date() } }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!currentPeriod) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    const result = await UniversityPeriodModel.findByIdAndUpdate(currentPeriod._id, req.body).catch((err) => {
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
})

export default router;