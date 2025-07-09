import {config} from 'dotenv';

// eslint-disable-next-line no-undef
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`}); // Load environment variables from .env file

export const {
    SERVER_URL, // Export the SERVER_URL variable from the environment
    PORT, NODE_ENV,
    DB_URI,
    JWT_SECRET, JWT_EXPIRATION,
    ARCJET_ENV, ARCJET_API_KEY,
    QSTASH_TOKEN, QSTASH_URL,
    EMAIL_PASSWORD,
// eslint-disable-next-line no-undef
} = process.env; // Export the PORT variable from the environment
//This allows you to dynamically use different settings (like the port or database URL) based on environment

