import Joi from 'joi';

/**
 * Environment configuration
 * @module config
 * @description Environment variables validation and configuration
 */
const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().port().default(5000),
    MONGODB_URI: Joi.string().uri().required().description('MongoDB connection string'),
    CORS_ORIGIN: Joi.string().default('http://localhost:5173').description('Comma separated list of allowed origins'),
    RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1).default(900000),
    RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
    LOG_MAX_SIZE: Joi.string().default('20m'),
    LOG_MAX_FILES: Joi.string().default('14d'),
}).unknown();

const { error, value: env } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
    console.error('Invalid environment variables:');
    error.details.forEach((detail) => {
        console.error(`   - ${detail.message}`);
    });
    throw new Error('Environment validation failed');
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
    logging: {
        maxSize: env.LOG_MAX_SIZE,
        maxFiles: env.LOG_MAX_FILES,
    },
};
export default config;