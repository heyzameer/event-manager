const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const convertToUTC = (dateStr, tz) => {
    return dayjs.tz(dateStr, tz).utc().toDate();
};


const toUserTZ = (utcDate, tz) => {
    return dayjs(utcDate).tz(tz).format();
};

const nowUTC = () => dayjs().utc().toDate();

module.exports = { convertToUTC, toUserTZ, nowUTC };
