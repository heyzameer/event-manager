import dayjs from 'dayjs';
import { logger } from './logger.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const convertToUTC = (dateStr, tz) => {
    logger.info('DEBUG: convertToUTC entry: ' + JSON.stringify({ dateStr, tz }));

    const naiveDateStr = typeof dateStr === 'string'
        ? dateStr.replace(/Z$/, '').replace(/[+-]\d{2}:\d{2}$/, '')
        : dateStr;

    const result = dayjs.tz(naiveDateStr, tz).utc();
    logger.info('DEBUG: convertToUTC result: ' + result.format());
    return result.toDate();
};

export const toUserTZ = (utcDate, tz) => {
    return dayjs(utcDate).tz(tz).format();
};

export const nowUTC = () => dayjs().utc().toDate();
