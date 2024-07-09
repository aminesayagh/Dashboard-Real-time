import type { Request, Response } from 'express';
import { ApiResponseSuccess, ApiResponseError, ApiSuccessResponsePagination } from '@org/shared-ts';


// Interface for a delete response with count of deleted items
export type ApiDeleteResponse = Response<ApiResponseSuccess<{ deletedCount: number }> | ApiResponseError>;

// Union type for any possible API response
export type IApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

// Type alias for an API response with generic data
export type ApiResponse<T> = Response<IApiResponse<T>>;

export type IApiResponsePagination<T> = ApiSuccessResponsePagination<T> | ApiResponseError;
export type ApiResponsePagination<T> = Response<IApiResponsePagination<T>>;

// Generic type alias for an API request with optional body, query, and URL parameters
type DefaultB = Record<string, object>;
type DefaultQ = qs.ParsedQs;
type DefaultP = Record<string, string>;
export type ApiRequest<B = DefaultB, Q = DefaultQ, P = DefaultP> = Request<P, unknown, B, Q>;