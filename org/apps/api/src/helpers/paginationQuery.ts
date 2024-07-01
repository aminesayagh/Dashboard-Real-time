import { NextFunction } from 'express';
import * as qs from 'qs';
import * as z from 'zod';
import { ApiRequest, ApiResponse } from '../types/Api';
import { badRequestError } from './error/BadRequestError';
import { ERRORS } from '../constants/MESSAGE';

const ZodPagination = z.object({
    filter: z.object({}).optional(),
    limit: z.number().int().positive().default(10),
    page: z.number().int().positive().default(1),
});

export type PaginationBody = z.infer<typeof ZodPagination>;

export const paginationQuery = (req: ApiRequest<unknown, {
    filter?: string;
    limit?: string;
    page?: string;
}>, _: ApiResponse<unknown>, next: NextFunction): void => {
    const { filter: filterQuery, limit: limitQuery, page: pageQuery } = qs.parse(req.query);

    try {
        const { filter, limit, page } = ZodPagination.parse({ filter: filterQuery, limit: limitQuery, page: pageQuery });
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