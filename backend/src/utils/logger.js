import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config/index.js';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

export const logger = winston.createLogger({
    level: config.env === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${level}] ${timestamp} ${message}`;
                })
            ),
        }),
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: config.logging.maxSize,
            maxFiles: config.logging.maxFiles
        }),
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: config.logging.maxSize,
            maxFiles: config.logging.maxFiles
        }),
    ],
});
