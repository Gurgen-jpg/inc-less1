"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const common_1 = require("../../models/common");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    const [login, password] = Buffer.from(token, 'base64').toString().split(':');
    if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    return next();
};
exports.authMiddleware = authMiddleware;
