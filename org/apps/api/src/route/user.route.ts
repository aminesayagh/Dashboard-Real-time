import express, { NextFunction } from 'express';
import UserModel, { HydratedUser } from "../model/User.model";
import { ApiResponsePagination, ApiRequest, ApiResponse } from "../types/Api";
import { UserMeAggregate, User } from '../types/Models';
import { PublicDoc, toPublicDoc } from '../types/Mongoose';
import { ERRORS } from '../constants/MESSAGE';
import { Error } from 'mongoose';
import { badRequestError } from '../helpers/error/BadRequestError';
import { paginationQuery, PaginationBody } from '../helpers/paginationQuery';
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
router.get('/:id', async (req: ApiRequest, res: ApiResponse<PublicUser>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.findById(id);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// PUT /api/v1/users/:id
router.put('/:id', async (req: ApiRequest<Partial<User>>, res: ApiResponse<PublicUser>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// DELETE /api/v1/users/:id
router.delete('/:id', async (req: ApiRequest, res: ApiDeleteResponse): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.deleteOne({ _id: id });
        if (!result || result.deletedCount === 0) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: { deletedCount: result.deletedCount } });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// GET /api/v1/users/me/:id
router.get('/me/:id', async (req: ApiRequest, res: ApiResponse<UserMeAggregate>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.me(id);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// GET /api/v1/users/email/:email
router.get('/email/:email', async (req: ApiRequest, res: ApiResponse<PublicUser>): Promise<void> => {
    const { email } = req.params;
    try {
        const result = await UserModel.findByEmail(email);
        if (!result) {
            res.status(404).json({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.status(200).json({ status: 'success', data: toPublicDoc(result) });
    } catch (err: any) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

export default router;
