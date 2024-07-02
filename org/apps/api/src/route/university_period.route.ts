import express, { NextFunction } from 'express';
import { ERRORS } from '../constants/MESSAGE';
import UniversityPeriodModel, { HydratedUniversityPeriod } from '../model/UniversityPeriod.model';
import { ApiDeleteResponse, ApiRequest, ApiResponse, ApiResponsePagination } from '../types/Api';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { UniversityPeriod } from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';
import { Types } from 'mongoose';

const router = express.Router();

type PublicUniversityPeriod = PublicDoc<HydratedUniversityPeriod>;

// GET /api/v1/university_periods
router.get('/', paginationQuery, async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<UniversityPeriod>, next: NextFunction): Promise<void> => {
    const { filter, limit, page } = req.body;
    UniversityPeriodModel.paginate(filter, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.send({
            status: 'success',
            data: result
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/university_periods
router.post('/', async (req: ApiRequest, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction): Promise<void> => {
    const universityPeriod = new UniversityPeriodModel(req.body);
    universityPeriod.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/university_periods/current
router.get('/current', async (_: ApiRequest, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    UniversityPeriodModel.findCurrentPeriod().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/university_periods/current
router.put('/current', async (req: ApiRequest<Partial<PublicUniversityPeriod>>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    UniversityPeriodModel.findCurrentPeriod().then((currentPeriod) => {
        if (!currentPeriod) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }

        UniversityPeriodModel.updateCurrentPeriod(req.body).then((result) => {
            if (!result) {
                next(badRequestError({ message: ERRORS.INTERNAL_SERVER_ERROR }));
                return;
            }
            res.send({
                status: 'success',
                data: toPublicDoc(result)
            });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
})

// GET /api/v1/university_periods/:id
router.get('/:id', idQuery(),async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    const { id } = req.body;
    UniversityPeriodModel.findById(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/university_periods/:id
router.put('/:id', idQuery(), async (req: ApiRequest<Partial<PublicUniversityPeriod & { id: Types.ObjectId }>>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    const { id } = req.body;
    UniversityPeriodModel.findByIdAndUpdate(id, req.body, { new: true }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/university_periods/:id
router.delete('/:id', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction) => {
    const { id } = req.body;
    UniversityPeriodModel.deleteOne({ _id: id }).then((result) => {
        if (!result || result.deletedCount === 0) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).send({ status: 'success', data: { deletedCount: result.deletedCount } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/university_periods/:id/next
router.get('/:id/next', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    const { id } = req.body;
    UniversityPeriodModel.findById(id).populate('period_next').then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/university_periods/:id/previous
router.get('/:id/previous', idQuery(),async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
    const { id } = req.body;
    UniversityPeriodModel.findById(id).populate('period_previous').then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.send({
            status: 'success',
            data: toPublicDoc(result)
        });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

export default router;