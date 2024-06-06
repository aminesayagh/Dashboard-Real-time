"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, json } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), logFormat),
    defaultMeta: { service: 'backend-api-real_time_dash' },
    transports: [
        new winston_1.transports.Console({
            format: combine(colorize(), logFormat)
        }),
        new winston_1.transports.File({ filename: 'error.log', level: 'error', format: combine() }),
        new winston_1.transports.File({ filename: 'combined.log', format: combine(timestamp(), json()) }),
    ],
});
exports.default = logger;
