import express from 'express';
import { ERRORS } from '../constants/MESSAGE';
import UniversityPeriodModel, { HydratedUniversityPeriod } from '../model/UniversityPeriod.model';
import { ApiRequest, ApiResponse, ApiResponsePagination, IApiDeleteResponse } from 'types/Api';
import qs from 'qs';
import { PublicDoc, toPublicDoc } from '@/types/Mongoose';
import { UniversityPeriod } from '../types/Models';

const router = express.Router();

type PublicUniversityPeriod = PublicDoc<HydratedUniversityPeriod>;

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<UniversityPeriod>): Promise<void> => {
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

router.post('/', async (req: ApiRequest, res: ApiResponse<PublicUniversityPeriod>): Promise<void> => {
    const universityPeriod = new UniversityPeriodModel(req.body);
    try{
        const result = await universityPeriod.save()
        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

router.get('/current', async (_: ApiRequest, res: ApiResponse<PublicUniversityPeriod>) => {
    try{
        const result = await UniversityPeriodModel.findCurrentPeriod()
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.put('/current', async (req: ApiRequest<Partial<PublicUniversityPeriod>>, res: ApiResponse<PublicUniversityPeriod>) => {
    try{
        const currentPeriod = await UniversityPeriodModel.findCurrentPeriod();
        console.log('findCurrentPeriod:', await UniversityPeriodModel.findCurrentPeriod());
        console.log('currentPeriod:', currentPeriod);
        if (!currentPeriod) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        const result = await UniversityPeriodModel.findByIdAndUpdate(currentPeriod._id, req.body, { new: true })
        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
})

router.get('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<PublicUniversityPeriod>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id)
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.put('/:id', async (req: ApiRequest<Partial<PublicUniversityPeriod>, {}, { id: string }>, res: ApiResponse<PublicUniversityPeriod>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: IApiDeleteResponse) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.deleteOne({ _id: id })
        if (!result || result.deletedCount === 0) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: { deletedCount: result.deletedCount } });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.get('/:id/next', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<PublicUniversityPeriod>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id).populate('period_next')
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});
router.get('/:id/previous', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<PublicUniversityPeriod>) => {
    const { id } = req.params;
    try{
        const result = await UniversityPeriodModel.findById(id).populate('period_previous')
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }catch (err:any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

export default router;