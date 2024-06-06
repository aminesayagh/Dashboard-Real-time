import type { Request, Response } from 'express';

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

// Interface for pagination metadata
interface IPaginationMeta {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    pagingCounter?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    meta?: unknown;
}

// Interface for a paginated successful API response
export interface IApiSuccessResponsePagination<T> extends IApiResponseBase, IPaginationMeta {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: T[];
}

// Interface for a delete response with count of deleted items
export interface IApiDeleteResponse extends IApiResponseSuccess<{ deletedCount: number }> {}

// Union type for any possible API response
export type IApiResponse<T> = IApiResponseSuccess<T> | IApiResponseError | IApiSuccessResponsePagination<T>;

// Type alias for an API response with generic data
export type ApiResponse<T = any> = Response<IApiResponse<T>>;

// Generic type alias for an API request with optional body, query, and URL parameters
export type ApiRequest<B = any, Q = any, P = any> = Request<P, any, B, Q>;