import type { Request, Response } from 'express';
import { PaginateResult } from 'mongoose';

// Define the API response status constants
export const API_RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

// Type for API response status values
type TApiResponseStatus = typeof API_RESPONSE_STATUS[keyof typeof API_RESPONSE_STATUS];

// Base interface for all API responses
interface IApiResponseBase {
    status: TApiResponseStatus;
}

// Interface for a successful API response with generic data
export interface IApiResponseSuccess<T> extends IApiResponseBase {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: T;
}

// Interface for an error API response
export interface IApiResponseError extends IApiResponseBase {
    status: typeof API_RESPONSE_STATUS.ERROR;
    message: string;
}

// Interface for a paginated successful API response
export interface IApiSuccessResponsePagination<T> extends IApiResponseBase {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: PaginateResult<T>;
}


// Interface for a delete response with count of deleted items
export type ApiDeleteResponse = Response<IApiResponseSuccess<{ deletedCount: number }> | IApiResponseError>;

// Union type for any possible API response
export type IApiResponse<T> = IApiResponseSuccess<T> | IApiResponseError;

// Type alias for an API response with generic data
export type ApiResponse<T> = Response<IApiResponse<T>>;

export type IApiResponsePagination<T> = IApiSuccessResponsePagination<T> | IApiResponseError;
export type ApiResponsePagination<T> = Response<IApiResponsePagination<T>>;

// Generic type alias for an API request with optional body, query, and URL parameters
type DefaultB = Record<string, object>;
type DefaultQ = qs.ParsedQs;
type DefaultP = Record<string, string>;
export type ApiRequest<B = DefaultB, Q = DefaultQ, P = DefaultP> = Request<P, unknown, B, Q>;