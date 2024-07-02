import express, { NextFunction } from 'express';
import UserModel, { HydratedUser } from "../model/User.model";
import { ApiResponsePagination, ApiRequest, ApiResponse, ApiDeleteResponse } from "../types/Api";
import { UserMeAggregate, User } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { ERRORS } from '../constants/MESSAGE';
import { Error, Types } from 'mongoose';
import { badRequestError } from '../helpers/error/BadRequestError';
import { paginationQuery, PaginationBody } from '../middlewares/query';
import { idQuery } from '../middlewares/query';
const router = express.Router();

type PublicUser = PublicDoc<HydratedUser>;


router.get('/', paginationQuery, async (req: ApiRequest<PaginationBody>, res: ApiResponsePagination<User>, next: NextFunction): Promise<void> => {
    const { filter, limit, page } = req.body;
    UserModel.paginate(filter, { limit, page }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
        } 
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// POST /api/v1/users
router.post('/', async (req: ApiRequest, res: ApiResponse<PublicUser>, next: NextFunction): Promise<void> => {
    const user = new UserModel(req.body);
    user.save().then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/users/:id
router.get('/:id', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiResponse<PublicUser>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    UserModel.findById(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// PUT /api/v1/users/:id
router.put('/:id', idQuery(), async (req: ApiRequest<Partial<User> & {
    id: Types.ObjectId;
}>, res: ApiResponse<PublicUser>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    UserModel.findByIdAndUpdate(id, req.body, { new: true }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// DELETE /api/v1/users/:id
router.delete('/:id', idQuery(), async (req: ApiRequest<{ id: Types.ObjectId }>, res: ApiDeleteResponse, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    UserModel.deleteOne({ _id: id }).then((result) => {
        if (!result || result.deletedCount === 0) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/users/me/:id
router.get('/me/:id', idQuery(), async (req: ApiRequest<{
    id: Types.ObjectId;
}>, res: ApiResponse<UserMeAggregate>, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    UserModel.me(id).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: result });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

// GET /api/v1/users/email/:email
router.get('/email/:email', async (req: ApiRequest, res: ApiResponse<PublicUser>, next: NextFunction): Promise<void> => {
    const { email } = req.params;
    UserModel.findOne({ email }).then((result) => {
        if (!result) {
            next(badRequestError({ message: ERRORS.NOT_FOUND }));
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    }).catch((err: Error) => {
        next(badRequestError({ message: err.message || ERRORS.BAD_REQUEST }));
    });
});

export default router;