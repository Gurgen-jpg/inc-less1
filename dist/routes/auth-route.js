"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("../models/common");
const auth_service_1 = require("../domain/auth-service");
const token_authorization_1 = require("../middlewares/authValidation/token-authorization");
const registration_validation_1 = require("../validators/registration-validation");
const refresh_token_validation_1 = require("../middlewares/authValidation/refresh-token-validation");
const rate_limit_middleware_1 = require("../middlewares/rateLimit/rate-limit-middleware");
exports.authRoute = express_1.default.Router({});
const { OK, NO_CONTENT, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } = common_1.HTTP_STATUSES;
exports.authRoute.post('/login', rate_limit_middleware_1.rateLimitMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const token = yield auth_service_1.AuthService.login({ loginOrEmail, password }, {
        ip: req.ip,
        title: req.headers['user-agent']
    });
    if (!token || !token.accessToken || !token.refreshToken) {
        return res.sendStatus(UNAUTHORIZED);
    }
    return res
        .cookie('refreshToken', token === null || token === void 0 ? void 0 : token.refreshToken, { httpOnly: true, secure: true })
        .header('Cache-Control', 'no-cache')
        .status(OK).send({ accessToken: token === null || token === void 0 ? void 0 : token.accessToken });
}));
exports.authRoute.post('/logout', refresh_token_validation_1.refreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(UNAUTHORIZED);
    }
    const result = yield auth_service_1.AuthService.logout(refreshToken);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(UNAUTHORIZED).send(result === null || result === void 0 ? void 0 : result.errors);
}));
exports.authRoute.post('/refresh-token', refresh_token_validation_1.refreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(UNAUTHORIZED);
    }
    const token = yield auth_service_1.AuthService.refreshToken(refreshToken, {
        ip: req.ip,
        title: req.headers['user-agent']
    });
    if (!token || !token.accessToken || !token.refreshToken) {
        return res.sendStatus(UNAUTHORIZED);
    }
    return res
        .cookie('refreshToken', token === null || token === void 0 ? void 0 : token.refreshToken, { httpOnly: true, secure: true })
        .header('Cache-Control', 'no-cache')
        .status(OK).send({ accessToken: token === null || token === void 0 ? void 0 : token.accessToken });
}));
exports.authRoute.get('/me', token_authorization_1.tokenAuthorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const me = yield auth_service_1.AuthService.me((_a = req.context.user) === null || _a === void 0 ? void 0 : _a.id);
    return me ? res.status(OK).send(me) : res.sendStatus(NOT_FOUND);
}));
exports.authRoute.post('/registration', rate_limit_middleware_1.rateLimitMiddleware, (0, registration_validation_1.registerValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const result = yield auth_service_1.AuthService.register({ login, email, password });
    return (result === null || result === void 0 ? void 0 : result.status) === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(BAD_REQUEST).send(result === null || result === void 0 ? void 0 : result.errors);
}));
exports.authRoute.post('/registration-confirmation', rate_limit_middleware_1.rateLimitMiddleware, (0, registration_validation_1.emailConfirmationValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.confirmEmail(req.body.code);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(BAD_REQUEST).send(result === null || result === void 0 ? void 0 : result.errors);
}));
exports.authRoute.post('/registration-email-resending', rate_limit_middleware_1.rateLimitMiddleware, (0, registration_validation_1.resendEmailValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.resendEmail(req.body.email);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(BAD_REQUEST).send(result === null || result === void 0 ? void 0 : result.errors);
}));
exports.authRoute.post('/password-recovery', (0, registration_validation_1.resendEmailValidation)(), rate_limit_middleware_1.rateLimitMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.passwordRecovery(req.body.email);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(BAD_REQUEST).send(result === null || result === void 0 ? void 0 : result.errors);
}));
exports.authRoute.post('/new-password', (0, registration_validation_1.recoveryPasswordValidationMiddleware)(), rate_limit_middleware_1.rateLimitMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.newPassword(req.body.recoveryCode, req.body.newPassword);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result === null || result === void 0 ? void 0 : result.message)
        : res.status(BAD_REQUEST).send(result === null || result === void 0 ? void 0 : result.errors);
}));
