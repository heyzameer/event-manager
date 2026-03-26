const Joi = require("joi");

const envScheme = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    MONGODB_URI: Joi.string().required(),
    CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
    RATE_LIMIT_MAX: Joi.number().default(100),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    port: env.PORT,
    env: env.NODE_ENV,
    database: {
        uri: env.MONGODB_URI,
    },
    cors: {
        origin: env.CORS_ORIGIN.split(','),
    },
    rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX,
    },
};
module.exports = config;