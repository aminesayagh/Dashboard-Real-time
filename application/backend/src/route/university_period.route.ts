import express from 'express';
import { ERRORS } from '../constants/ERRORS';
import UniversityPeriodModel, { IUniversityPeriodDocument } from '../model/UniversityPeriod.model';
import { ApiRequest, ApiResponse, ApiResponsePagination } from 'types/Api';
import qs from 'qs';
const router = express.Router();


router.get('/', async (req: ApiRequest, res: ApiResponsePagination<IUniversityPeriodDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    try{
        const result = await UniversityPeriodModel.paginate(filter, options)
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

router.post('/', async (req: ApiRequest, res: ApiResponse<IUniversityPeriodDocument>): Promise<void> => {
    const universityPeriod = new UniversityPeriodModel(req.body);
    try{
        const result = await universityPeriod.save()
        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

router.get('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id)
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.put('/:id', async (req: ApiRequest<Partial<IUniversityPeriodDocument>, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findByIdAndUpdate(id, req.body)
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findByIdAndDelete(id)
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.get('/:id/next', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id).populate('next')
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.get('/:id/previous', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<IUniversityPeriodDocument>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id).populate('previous')
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.get('/current', async (_: ApiRequest, res: ApiResponse<IUniversityPeriodDocument>) => {
    try{
        const result = await UniversityPeriodModel.findOne({ period_date_start: { $lte: new Date() }, period_date_end: { $gte: new Date() } })
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.put('/current', async (req: ApiRequest<Partial<IUniversityPeriodDocument>>, res: ApiResponse<IUniversityPeriodDocument>) => {
    try{
        const currentPeriod = await UniversityPeriodModel.findOne({ period_date_start: { $lte: new Date() }, period_date_end: { $gte: new Date() } })
        if (!currentPeriod) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        const result = await UniversityPeriodModel.findByIdAndUpdate(currentPeriod._id, req.body)
        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
})

export default router;