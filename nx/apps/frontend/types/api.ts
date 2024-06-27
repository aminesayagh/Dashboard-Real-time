
// Define the API response status constants
export const API_RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

type TApiResponseStatus = typeof API_RESPONSE_STATUS[keyof typeof API_RESPONSE_STATUS];

interface IApiResponseBase {
    status: TApiResponseStatus;
}

// Interface for a successful API response with generic data
export interface ApiResponseSuccess<T> extends IApiResponseBase {
    status: typeof API_RESPONSE_STATUS.SUCCESS;
    data: T;
}

// Interface for an error API response
export interface ApiResponseError extends IApiResponseBase {
    status: typeof API_RESPONSE_STATUS.ERROR;
    message: string;
}

// Type alias for an API response with generic data
export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;