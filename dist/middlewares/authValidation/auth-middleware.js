"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const common_1 = require("../../models/common");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_service_1 = require("../../app/auth/jwt-service");
var AUTH_TYPES;
(function (AUTH_TYPES) {
    AUTH_TYPES["BASIC"] = "Basic";
    AUTH_TYPES["BEARER"] = "Bearer";
})(AUTH_TYPES || (AUTH_TYPES = {}));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    const [authType, token] = auth.split(' ');
    if (authType !== AUTH_TYPES.BASIC && authType !== AUTH_TYPES.BEARER) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
        return;
    }
    if (authType === AUTH_TYPES.BASIC) {
        const [login, password] = Buffer.from(token, 'base64').toString().split(':');
        if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
            res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
            return;
        }
        return next();
    }
    if (authType === AUTH_TYPES.BEARER) {
        const userId = jwt_service_1.JwtService.verifyJWT(token);
        if (!userId) {
            res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED);
            return;
        }
        req.context = {
            user: {
                id: userId
            }
        };
        return next();
    }
};
exports.authMiddleware = authMiddleware;
