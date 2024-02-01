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
const auth_validation_1 = require("../validators/auth-validation");
const auth_service_1 = require("../domain/auth-service");
exports.authRoute = express_1.default.Router({});
const { NO_CONTENT, UNAUTHORIZED } = common_1.HTTP_STATUSES;
exports.authRoute.post('/login', (0, auth_validation_1.authValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const isLogin = yield auth_service_1.AuthService.login({ loginOrEmail, password });
    isLogin ? res.sendStatus(NO_CONTENT) : res.sendStatus(UNAUTHORIZED);
}));
