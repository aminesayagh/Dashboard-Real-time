export type CustomErrorContent = {
    message: string;
    context?: Context
}

export type Context = {
    [key: string]: unknown;
}

export const USED_CODES_ERROR = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
} as const;

export const usedCodesErrors = Object.values(USED_CODES_ERROR); // [400, 401, 403, 404, 409, 500]
export type UsedCodesError = typeof usedCodesErrors[number];

export abstract class CustomError extends Error {
    abstract readonly statusCode: UsedCodesError;
    abstract readonly errors: CustomErrorContent[];
    abstract readonly logging: boolean;

    constructor(message: string) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

