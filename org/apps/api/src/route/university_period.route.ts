import { NextFunction } from 'express';
import { ERRORS } from '../constants/MESSAGE';
import UniversityPeriodModel, { HydratedUniversityPeriod } from '../model/UniversityPeriod.model';
import { ApiDeleteResponse, ApiRequest, ApiResponse, ApiResponsePagination } from '../types/Api';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { UniversityPeriod } from '../types/Models';
import { idQuery, PaginationBody, paginationQuery } from '../middlewares/query';
import { badRequestError } from '../helpers/error/BadRequestError';
import { Types } from 'mongoose';
import ManagerController from '../helpers/Controller';


type PublicUniversityPeriod = PublicDoc<HydratedUniversityPeriod>;

// export default router;

export default class UniversityPeriodController extends ManagerController {
    constructor() {
        super('/university_periods');
        this.initRoutes();
    }
    private initRoutes() {
        this.router.get('/', paginationQuery, this.getAll);
        this.router.post('/', this.create);
        this.router.get('/current', this.getCurrent);
        this.router.put('/current', this.updateCurrent);
        this.router.get('/:id', idQuery(), this.getOne);
        this.router.put('/:id', idQuery(), this.update);
        this.router.delete('/:id', idQuery(), this.delete);
        this.router.get('/:id/next', idQuery(), this.getNext);
        this.router.get('/:id/previous', idQuery(), this.getPrevious);
    }
    private getAll = async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<UniversityPeriod>, next: NextFunction): Promise<void> => {
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
    }
    private create = async (req: ApiRequest, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction): Promise<void> => {
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
    }
    private getCurrent = async (_: ApiRequest, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
    private updateCurrent = async (req: ApiRequest<Partial<PublicUniversityPeriod>>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
    private getOne = async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
    private update = async (req: ApiRequest<Partial<PublicUniversityPeriod & { id: Types.ObjectId }>>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
    private delete = async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction) => {
        const { id } = req.body;
        UniversityPeriodModel.deleteOne({ _id: id }).then((result) => {
            if (!result || result.deletedCount === 0) {
                res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
                return;
            }
            res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
        }).catch((err: Error) => {
            next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
        });
    }
    private getNext = async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
    private getPrevious = async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUniversityPeriod>, next: NextFunction) => {
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
    }
}