import { config as dotenv } from "dotenv";
dotenv();

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    frontendDomain: process.env.FRONTEND_DOMAIN,
    jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
