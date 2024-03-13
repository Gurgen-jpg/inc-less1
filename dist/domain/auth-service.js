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
const add_1 = require("date-fns/add");
const uuid_1 = require("../adapters/uuid");
const auth_repository_1 = require("../repositories/auth-repository");
const session_repository_1 = require("../repositories/session-repository");
class AuthService {
    static login(payload, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { loginOrEmail, password } = payload;
            try {
                const user = yield user_repository_1.UserRepository.getUserByLoginOrEmail(loginOrEmail);
                if (!user) {
                    throw new Error('user not found');
                }
                else {
                    const isCredentialsCorrect = yield bcrypt_1.default.compare(password, user.accountData.passwordHash);
                    if (!isCredentialsCorrect) {
                        throw new Error('wrong password');
                    }
                    else {
                        const accessToken = yield jwt_service_1.JwtService.createJWT(user._id.toString(), '10s');
                        const { userId, iat, exp, } = jwt_service_1.JwtService.getPayload(accessToken);
                        const { ip, title } = sessionData;
                        const currentDeviceId = (0, uuid_1.generateId)();
                        yield session_repository_1.SessionRepository.createSession({
                            ip,
                            userId,
                            deviceId: currentDeviceId,
                            title,
                            lastActiveDate: new Date().toISOString(),
                            expirationDate: exp
                        });
                        const refreshToken = yield jwt_service_1.JwtService.createJWT(user._id.toString(), '20s', currentDeviceId);
                        if (!accessToken || !refreshToken) {
                            throw new Error('wrong token');
                        }
                        return ({
                            accessToken,
                            refreshToken,
                        });
                    }
                }
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    static logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isTokenBlackList = yield auth_repository_1.AuthRepository.isTokenBlacklisted(refreshToken);
                if (isTokenBlackList) {
                    throw new Error('Token in blacklist');
                }
                yield auth_repository_1.AuthRepository.addTokenToBlackList(refreshToken);
                const tokenData = yield jwt_service_1.JwtService.getPayload(refreshToken);
                yield session_repository_1.SessionRepository.deleteSession({ userId: tokenData.userId, deviceId: tokenData.deviceId });
                return {
                    status: 204,
                    message: 'Logout success'
                };
            }
            catch (e) {
                console.error(e);
                return {
                    status: 401,
                    errors: {
                        errorsMessages: [
                            {
                                message: 'Invalid token',
                                field: 'refreshToken'
                            }
                        ]
                    }
                };
            }
        });
    }
    static refreshToken(refreshToken, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refreshToken) {
                    throw new Error('Invalid token');
                }
                const isTokenBlackList = yield auth_repository_1.AuthRepository.isTokenBlacklisted(refreshToken);
                if (isTokenBlackList) {
                    throw new Error('Token in blacklist');
                }
                const userId = yield jwt_service_1.JwtService.verifyJWT(refreshToken);
                const isTokenExpired = jwt_service_1.JwtService.isTokenExpired(refreshToken);
                if (isTokenExpired) {
                    throw new Error('refresh token expired');
                }
                const tokenData = yield jwt_service_1.JwtService.getPayload(refreshToken);
                yield session_repository_1.SessionRepository.updateSession({ deviceId: tokenData.deviceId, title: sessionData.title }, {
                    ip: sessionData.ip,
                    userId: tokenData.userId,
                    deviceId: tokenData.deviceId,
                    title: sessionData.title,
                    lastActiveDate: tokenData.iat,
                    expirationDate: tokenData.exp
                });
                const accessToken = yield jwt_service_1.JwtService.createJWT(userId, '10s');
                const newRefreshToken = yield jwt_service_1.JwtService.createJWT(userId, '20s', tokenData.deviceId);
                yield auth_repository_1.AuthRepository.addTokenToBlackList(refreshToken);
                return ({
                    accessToken: accessToken,
                    refreshToken: newRefreshToken
                });
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
                return {
                    login: user.login,
                    email: user.email,
                    userId: user.id,
                };
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
                const userLoginExist = yield user_repository_1.UserRepository.getUserByLoginOrEmail(login);
                const userEmailExist = yield user_repository_1.UserRepository.getUserByLoginOrEmail(email);
                if (userLoginExist) {
                    return {
                        status: 400,
                        errors: {
                            errorsMessages: [
                                {
                                    message: 'User already exists',
                                    field: 'login'
                                }
                            ]
                        }
                    };
                }
                if (userEmailExist) {
                    return {
                        status: 400,
                        errors: {
                            errorsMessages: [
                                {
                                    message: 'User already exists',
                                    field: 'email'
                                }
                            ]
                        }
                    };
                }
                const hash = yield bcrypt_service_1.BcryptService.createHash(password);
                if (!hash) {
                    throw new Error('Problem hashing password');
                }
                const userId = yield user_repository_1.UserRepository.createUser({
                    accountData: {
                        login,
                        email,
                        passwordHash: hash,
                        createdAt: new Date().toISOString()
                    },
                    emailConfirmation: {
                        confirmationCode: (0, uuid_1.generateId)(),
                        expirationDate: (0, add_1.add)(new Date(), {
                            hours: 1,
                            minutes: 2
                        }),
                        isConfirmed: false
                    },
                });
                if (!userId) {
                    throw new Error('Error creating user');
                }
                try {
                    const user = yield user_repository_1.UserRepository.getUserById(userId);
                    if (!user) {
                        throw new Error('bad user id maybe deleted user');
                    }
                    yield email_adapter_1.EmailAdapter.sendMail(email, login, 'Подтверждение регистрации', user.emailConfirmation.confirmationCode);
                }
                catch (e) {
                    console.error(e);
                    // await UserRepository.deleteUser(userId);
                }
                return {
                    status: 204,
                    message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
                };
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    static confirmEmail(emailCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_repository_1.UserRepository.confirmEmail(emailCode);
                if (!user)
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'Bad confirmation code', field: 'code' }] }
                    };
                if (user.emailConfirmation.confirmationCode !== emailCode)
                    return {
                        status: 400,
                        errors: {
                            errorsMessages: [{ message: 'Bad confirmation code', field: 'code' }]
                        }
                    };
                if (user.emailConfirmation.isConfirmed) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'Code was confirmed later', field: 'code' }] },
                    };
                }
                if (user.emailConfirmation.confirmationCode === emailCode && user.emailConfirmation.expirationDate < new Date()) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'Code expired', field: 'code' }] },
                    };
                }
                const confirm = yield user_repository_1.UserRepository.updateIsConfirmed(user._id, true);
                if (!confirm) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'Bad confirmation code', field: 'code' }] }
                    };
                }
                return {
                    status: 204,
                    message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
                };
            }
            catch (e) {
                console.error(e);
                return {
                    status: 400, errors: {
                        errorsMessages: [{
                                message: 'Bad confirmation code',
                                field: 'code'
                            }]
                    }
                };
            }
        });
    }
    static resendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_repository_1.UserRepository.getUserByLoginOrEmail(email);
                if (!user) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'User not found', field: 'email' }] }
                    };
                }
                if (user.emailConfirmation.isConfirmed) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'Email already confirmed', field: 'email' }] }
                    };
                }
                const newCode = yield user_repository_1.UserRepository.updateConfirmationCode((0, uuid_1.generateId)(), user._id);
                if (!newCode) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'User not found', field: 'email' }] }
                    };
                }
                const isSend = yield email_adapter_1.EmailAdapter.sendMail(email, user.accountData.login, 'Подтверждение регистрации', newCode);
                if (!isSend) {
                    return {
                        status: 400,
                        errors: { errorsMessages: [{ message: 'User not found', field: 'email' }] }
                    };
                }
                return {
                    status: 204,
                    message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
                };
            }
            catch (e) {
                console.error(e);
                return { status: 400, errors: { errorsMessages: [{ message: 'User not found', field: 'email' }] } };
            }
        });
    }
}
exports.AuthService = AuthService;
