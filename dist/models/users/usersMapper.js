"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapper = void 0;
const usersMapper = (userDb) => ({
    userId: userDb._id.toString(),
    login: userDb.accountData.login,
    email: userDb.accountData.email,
    createdAt: userDb.accountData.createdAt
});
exports.usersMapper = usersMapper;
