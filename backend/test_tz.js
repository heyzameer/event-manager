const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const dateStr = "2026-03-26T06:19";
const tz = "Pacific/Niue"; // Niue Time (NUT) (UTC-11)

const result = dayjs.tz(dateStr, tz);
console.log("Input string:", dateStr);
console.log("Target TZ:", tz);
console.log("Dayjs object (with TZ):", result.format());
console.log("UTC conversion:", result.utc().format());

// Compare with local interpretation
const localResult = dayjs(dateStr);
console.log("\nLocal interpretation (Browser/Server TZ):", localResult.format());
console.log("Local interpretation in UTC:", localResult.utc().format());

const istTz = "Asia/Kolkata";
const resultIST = dayjs.tz(dateStr, istTz);
console.log("\nIST interpretation:", resultIST.format());
console.log("IST interpretation in UTC:", resultIST.utc().format());
