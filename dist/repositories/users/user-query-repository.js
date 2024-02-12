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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueryRepository = void 0;
const db_1 = require("../../db/db");
const usersMapper_1 = require("../../models/users/usersMapper");
const mongodb_1 = require("mongodb");
class UserQueryRepository {
    static getAllUsers(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            let { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = sortData;
            let filter = {};
            if (searchLoginTerm || searchEmailTerm) {
                filter = {
                    $or: []
                };
                if (searchLoginTerm) {
                    filter.$or.push({
                        login: {
                            $regex: searchLoginTerm,
                            $options: 'i'
                        }
                    });
                }
                if (searchEmailTerm) {
                    filter.$or.push({
                        email: {
                            $regex: searchEmailTerm,
                            $options: 'i'
                        }
                    });
                }
            }
            console.log(filter);
            try {
                const totalCount = yield db_1.usersCollection.countDocuments(filter);
                const pagesCount = Math.ceil(totalCount / pageSize);
                const users = yield db_1.usersCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .limit(pageSize)
                    .skip((pageNumber - 1) * pageSize)
                    .toArray();
                return {
                    pagesCount,
                    page: pageNumber,
                    pageSize,
                    totalCount,
                    items: users.map(usersMapper_1.usersMapper)
                };
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!user) {
                    return null;
                }
                return (0, usersMapper_1.usersMapper)(user);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
}
exports.UserQueryRepository = UserQueryRepository;
