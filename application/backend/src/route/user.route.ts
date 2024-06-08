import express from 'express';
import qs from 'qs'

import { ApiResponsePagination, ApiRequest, ApiResponse } from "types/Api";
import { IUserMeAggregate } from 'types/Aggregate';
import UserModel, { IUserDocument } from "../model/User.model";
import { ERRORS } from '../constants/ERRORS';

const router = express.Router();

router.get('/', async (req: ApiRequest, res: ApiResponsePagination<IUserDocument>): Promise<void> => {
    const { filter, ...options } = qs.parse(req.query) as any;
    const result = await UserModel.paginate(filter, options).catch((err) => {
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
})

router.post('/', async (req: ApiRequest, res: ApiResponse<IUserDocument>): Promise<void> => {
    const user = new UserModel(req.body);
    const result = await user.save().catch((err) => {
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

router.get('/:id', async (req: ApiRequest<{}, {}, {
    id: string;
}>, res: ApiResponse<IUserDocument>) => {
    const { id } = req.params;
    const result = await UserModel.findById(id).catch((err) => {
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
router.put('/:id', async (req: ApiRequest<Partial<IUserDocument>, {}, {
    id: string;
}>, res: ApiResponse<IUserDocument>) => {
    const { id } = req.params;
    const result = await UserModel.findByIdAndUpdate(id, req.body).catch((err) => {
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

router.delete('/:id', async (req: ApiRequest<{}, {}, { id: string }>, res: ApiResponse<{ deletedCount: number }>) => {
    const { id } = req.params;
    const result = await UserModel.deleteOne({ _id: id }).catch((err) => {
        res.status(400).send({ status: 'error', message: err.message });
    });
    if (!result) {
        res.status(404).send({ status: 'error', message: ERRORS.NOT_FOUND });
        return;
    }
    res.send({
        status: 'success',
        data: { deletedCount: result.deletedCount }
    });
});

router.get('/me', async (req: ApiRequest<any, {
    id: string;
}>, res: ApiResponse<IUserMeAggregate>) => {
    const { id } = req.params;
    const result = await UserModel.me(id).catch((err) => {
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

router.get('/:email', async (req: ApiRequest<{}, {}, {
    email: string;
}>, res: ApiResponse<IUserDocument>) => {
    const { email } = req.params;
    const result = await UserModel.findByEmail(email).catch((err) => {
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