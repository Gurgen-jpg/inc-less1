import dotenv from "dotenv";

dotenv.config()

const exportEnv = {
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_WORD: process.env.SECRET_WORD,
    AUTH_LOGIN: process.env.AUTH_LOGIN,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
}

const {
    MONGODB_URI,
    SECRET_WORD,
    AUTH_LOGIN,
    AUTH_PASSWORD,
    MAIL_PASS,
    MAIL_USER,
    MAIL_HOST,
    MAIL_PORT
} = exportEnv;

export {
    MONGODB_URI,
    SECRET_WORD,
    AUTH_LOGIN,
    AUTH_PASSWORD,
    MAIL_PASS,
    MAIL_USER,
    MAIL_HOST,
    MAIL_PORT
}
