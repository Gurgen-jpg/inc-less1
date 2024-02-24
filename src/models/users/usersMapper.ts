import {UserViewModel} from "./output";
import {UserDBModel} from "../db";
import {WithId} from "mongodb";

export const usersMapper = (userDb: WithId<UserDBModel>): UserViewModel => ({
    id: userDb._id.toString(),
    login: userDb.accountData.login,
    email: userDb.accountData.email,
    createdAt: userDb.accountData.createdAt
})
