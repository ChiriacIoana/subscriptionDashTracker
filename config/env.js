import {config} from 'dotenv';

// eslint-disable-next-line no-undef
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`}); // Load environment variables from .env file

// eslint-disable-next-line no-undef
export const {PORT, NODE_ENV, DB_URI} = process.env; // Export the PORT variable from the environment
//This allows you to dynamically use different settings (like the port or database URL) based on environment

