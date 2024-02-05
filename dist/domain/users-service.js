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
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repositories/users/user-repository");
const user_query_repository_1 = require("../repositories/users/user-query-repository");
class UsersService {
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, email, password } = payload;
            const saltRound = 10;
            const createdAt = new Date().toISOString();
            // let userHash = ''
            try {
                const userHash = yield new Promise((resolve, reject) => {
                    bcrypt_1.default.hash(password, saltRound, (err, hash) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                            throw err;
                        }
                        resolve(hash);
                    });
                });
                const userId = yield user_repository_1.UserRepository.createUser({
                    login,
                    email,
                    password: userHash,
                    createdAt
                });
                if (!userId) {
                    throw new Error('Error creating user');
                }
                return yield user_query_repository_1.UserQueryRepository.getUserById(userId);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    static getAllUsers(query) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const sortData = {
                sortBy: (_a = query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
                sortDirection: (_b = query.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                searchLoginTerm: (_c = query.searchLoginTerm) !== null && _c !== void 0 ? _c : null,
                searchEmailTerm: (_d = query.searchEmailTerm) !== null && _d !== void 0 ? _d : null
            };
            try {
                return yield user_query_repository_1.UserQueryRepository.getAllUsers(sortData);
            }
            catch (e) {
                return null;
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_repository_1.UserRepository.deleteUser(id);
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.UsersService = UsersService;
