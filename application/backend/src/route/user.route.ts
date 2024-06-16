import express from 'express';
import qs from 'qs';
import UserModel, { IUserDocument } from "../model/User.model";
import { ApiResponsePagination, ApiRequest, ApiResponse } from "types/Api";
import { IUserMeAggregate } from 'types/Aggregate';
import { ERRORS } from '../constants/ERRORS';

const router = express.Router();

// GET /api/v1/users
router.get('/', async (req: ApiRequest, res: ApiResponsePagination<IUserDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    try {
        const result = await UserModel.paginate(filter, options);
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// POST /api/v1/users
router.post('/', async (req: ApiRequest, res: ApiResponse<IUserDocument>): Promise<void> => {
    try {
        const user = new UserModel(req.body);
        const result = await user.save();
        if (!result) {
            res.status(500).send({ status: 'error', message: ERRORS.INTERNAL_SERVER_ERROR });
            return;
        }
        res.status(201).send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// GET /api/v1/users/:id
router.get('/:id', async (req: ApiRequest, res: ApiResponse<IUserDocument>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.findById(id);
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// PUT /api/v1/users/:id
router.put('/:id', async (req: ApiRequest<Partial<IUserDocument>>, res: ApiResponse<IUserDocument>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// DELETE /api/v1/users/:id
router.delete('/:id', async (req: ApiRequest, res: ApiResponse<{ deletedCount: number }>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.deleteOne({ _id: id });
        if (!result || result.deletedCount === 0) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: { deletedCount: result.deletedCount } });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// GET /api/v1/users/me/:id
router.get('/me/:id', async (req: ApiRequest, res: ApiResponse<IUserMeAggregate>): Promise<void> => {
    const { id } = req.params;
    try {
        const result = await UserModel.me(id);
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

// GET /api/v1/users/email/:email
router.get('/email/:email', async (req: ApiRequest, res: ApiResponse<IUserDocument>): Promise<void> => {
    const { email } = req.params;
    try {
        const result = await UserModel.findByEmail(email);
        if (!result) {
            res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
            return;
        }
        res.send({ status: 'success', data: result });
    } catch (err: any) {
        res.status(400).send({ status: 'error', message: err.message });
    }
});

export default router;
