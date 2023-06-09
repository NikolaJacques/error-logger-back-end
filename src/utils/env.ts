import * as dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_TEST_URI = process.env.MONGO_TEST_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
export const AUTH_URI = process.env.AUTH_URI;
export const LOGS_URI = process.env.LOGS_URI;