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
const auth_middleware_1 = require("../middlewares/authValidation/auth-middleware");
exports.authRoute = express_1.default.Router({});
const { OK, NO_CONTENT, UNAUTHORIZED } = common_1.HTTP_STATUSES;
exports.authRoute.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const token = yield auth_service_1.AuthService.login({ loginOrEmail, password });
    return token
        ? res.status(OK).send({ token })
        : res.sendStatus(UNAUTHORIZED);
}));
exports.authRoute.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const me = yield auth_service_1.AuthService.me((_a = req.context.user) === null || _a === void 0 ? void 0 : _a.id);
    res.send(me);
}));
