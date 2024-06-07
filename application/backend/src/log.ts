import {
    createLogger,
    format,
    transports,
} from 'winston';

const { combine, timestamp, printf, colorize, json } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export default createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    defaultMeta: { service: 'backend-api-real_time_dash' },
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        new transports.File({ filename: 'error.log', level: 'error', format: combine() }),
        new transports.File({ filename: 'combined.log', format: combine(
            timestamp(),
            json()
        ) }),
    ],
});

