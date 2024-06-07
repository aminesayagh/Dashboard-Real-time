


export const ERRORS = {
    // auth errors
    BAD_CREDENTIALS: 'User is not using credential password',
    DON_T_HAVE_PASSWORD: 'User don\'t have password',
    PASSWORD_ALREADY_USED: 'Password is already used',
    // student errors
    INVALID_STATE_TRANSITION_STUDENT: 'Invalid state transition for student',
    // http errors
    NOT_FOUND: 'Not Found', // 404
    BAD_REQUEST: 'Bad Request', // 400
    UNAUTHORIZED: 'Unauthorized', // 401
    FORBIDDEN: 'Forbidden', // 403
    INTERNAL_SERVER_ERROR: 'Internal Server Error', // 500
    // user errors
    USER_NOT_FOUND: 'User not found',
} as const;