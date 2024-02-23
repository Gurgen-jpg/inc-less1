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
exports.UserRepository = void 0;
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
class UserRepository {
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.usersCollection.insertOne(user)
                    .then((id) => {
                    if (!id) {
                        return null;
                    }
                    return id.insertedId.toString();
                });
            }
            catch (e) {
                return null;
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteResult = yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return deleteResult.deletedCount > 0;
            }
            catch (e) {
                return false;
            }
        });
    }
    static getUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.usersCollection
                    .findOne({ $or: [{ "accountData.login": loginOrEmail }, { "accountData.email": loginOrEmail }] })
                    .then((user) => {
                    return user ? user : null;
                })
                    .catch((err) => {
                    throw err;
                });
            }
            catch (e) {
                console.log('can not find user', e);
                return null;
            }
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (e) {
                return null;
            }
        });
    }
    static confirmEmail(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.usersCollection.findOne({
                    'emailConfirmation.confirmationCode': confirmationCode
                });
                if (!user) {
                    return null;
                }
                return user;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    static updateIsConfirmed(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_1.usersCollection.updateOne({ _id: userId }, { $set: { 'emailConfirmation.isConfirmed': true } });
                if (res && res.modifiedCount === 1) {
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static updateConfirmationCode(code, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.usersCollection.updateOne({ _id: userId }, { $set: { 'emailConfirmation.confirmationCode': code } });
                if (result.modifiedCount === 1) {
                    return code;
                }
                return null;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
}
exports.UserRepository = UserRepository;
