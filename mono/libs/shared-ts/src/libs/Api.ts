

// Define the API response status constants
export const API_RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

// Type for API response status values
type ApiResponseStatus = typeof API_RESPONSE_STATUS[keyof typeof API_RESPONSE_STATUS];

// Base interface for all API responses
interface ApiResponseBase {
    status: ApiResponseStatus;
}

export interface ApiResponseSuccess<T> extends ApiResponseBase {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: T;
}


// Interface for an error API response
export interface ApiResponseError extends ApiResponseBase {
    status: typeof API_RESPONSE_STATUS.ERROR;
    message: string;
}

interface PaginateResult<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page?: number | undefined;
    totalPages: number;
    offset: number;
    prevPage?: number | null | undefined;
    nextPage?: number | null | undefined;
    pagingCounter: number;
    meta?: any;
    [customLabel: string]: T[] | number | boolean | null | undefined;
}

// Interface for a paginated successful API response
export interface ApiSuccessResponsePagination<T> extends ApiResponseBase {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: PaginateResult<T>;
}


// Union type for any possible API response
export type IApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;