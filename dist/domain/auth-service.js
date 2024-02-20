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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_service_1 = require("../app/auth/jwt-service");
const user_repository_1 = require("../repositories/users/user-repository");
const user_query_repository_1 = require("../repositories/users/user-query-repository");
const email_adapter_1 = require("../adapters/email-adapter");
const bcrypt_service_1 = require("../app/auth/bcrypt-service");
class AuthService {
    static login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = payload;
            try {
                const user = yield user_repository_1.UserRepository.getUserByLoginOrEmail(loginOrEmail);
                if (!user) {
                    throw new Error('user not found');
                }
                else {
                    const isCredentialsCorrect = yield bcrypt_1.default.compare(password, user.password);
                    if (!isCredentialsCorrect) {
                        throw new Error('wrong password');
                    }
                    else {
                        return jwt_service_1.JwtService.createJWT(user);
                    }
                }
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    static me(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error('Invalid token');
                }
                const user = yield user_query_repository_1.UserQueryRepository.getUserById(userId);
                if (!user) {
                    throw new Error('bad user id maybe deleted user');
                }
                return user;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    static register(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = payload;
            try {
                const hash = yield bcrypt_service_1.BcryptService.createHash(password);
                if (!hash) {
                    throw new Error('Problem hashing password');
                }
                const user = yield user_repository_1.UserRepository.createUser({
                    login,
                    email,
                    password: hash,
                    createdAt: new Date().toISOString(),
                    isConfirm: false
                });
                return null;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    static registerConfirm(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email } = payload;
            const subject = 'Подтверждение регистрации';
            try {
                return yield email_adapter_1.EmailAdapter.sendMail(email, login, subject);
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
}
exports.AuthService = AuthService;
