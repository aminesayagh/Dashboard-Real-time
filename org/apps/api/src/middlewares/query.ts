import { NextFunction } from 'express';
import { Types } from 'mongoose';
import * as qs from 'qs';
import * as z from 'zod';
import { ApiRequest, ApiResponse } from '../types/Api';
import { badRequestError } from '../helpers/error/BadRequestError';
import { ERRORS } from '../constants/MESSAGE';
import { zodPagination, PaginationBody } from '@org/shared-ts';

export { PaginationBody };

export const paginationQuery = (req: ApiRequest<unknown, {
    filter?: string;
    limit?: string;
    page?: string;
}>, _: ApiResponse<unknown>, next: NextFunction): void => {
    const { filter: filterQuery, limit: limitQuery, page: pageQuery } = qs.parse(req.query);

    try {
        const { filter, limit, page } = zodPagination.parse({ filter: filterQuery, limit: limitQuery, page: pageQuery });
        req.body = { filter, limit, page } as PaginationBody;
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            next(badRequestError({ message: err.errors[0].message, context: { details: err.errors }, logging: true }));
        } else {
            next(badRequestError({ message: ERRORS.BAD_REQUEST }));
        }
    }
};

export const idQuery = (...idKeys: string[]) => {
    return (req: ApiRequest<Record<string, unknown>, { [key: string]: string }>, _: ApiResponse<unknown>, next: NextFunction): void => {
        const ids: { [key: string]: Types.ObjectId } = {};
        if (idKeys.length === 0) {
            idKeys.push('id');
        }
        for (const key of idKeys) {
            const id = req.params[key];
            if (!id) {
                next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                return;
            }
            const objectId = new Types.ObjectId(id);
            if (!objectId) {
                next(badRequestError({ message: ERRORS.BAD_REQUEST }));
                return;
            }
            ids[key] = objectId;
        }
        req.body = { ...req.body, ...ids };
        next();
    };
};