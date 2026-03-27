const dayjs = require('dayjs');
const { logger } = require('./logger');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const convertToUTC = (dateStr, tz) => {
    logger.info('DEBUG: convertToUTC entry: ' + JSON.stringify({ dateStr, tz }));
    
    // Force naive interpretation: Remove any trailing Z or timezone offsets (+/-HH:mm)
    // This ensures that even if the client sends an ISO string, we treat it as naive time in the target TZ.
    const naiveDateStr = typeof dateStr === 'string' 
        ? dateStr.replace(/Z$/, '').replace(/[+-]\d{2}:\d{2}$/, '') 
        : dateStr;

    const result = dayjs.tz(naiveDateStr, tz).utc();
    logger.info('DEBUG: convertToUTC result: ' + result.format());
    return result.toDate();
};


const toUserTZ = (utcDate, tz) => {
    return dayjs(utcDate).tz(tz).format();
};

const nowUTC = () => dayjs().utc().toDate();

module.exports = { convertToUTC, toUserTZ, nowUTC };
