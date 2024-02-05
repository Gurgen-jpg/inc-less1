"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapper = void 0;
const usersMapper = (usersBd) => ({
    id: usersBd._id.toString(),
    login: usersBd.login,
    email: usersBd.email,
    // createdAt: usersBd.createdAt
});
exports.usersMapper = usersMapper;
