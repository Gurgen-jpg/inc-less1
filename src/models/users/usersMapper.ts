import {UserViewModel} from "./output";
import {UserDBModel} from "../db";
import {WithId} from "mongodb";

export const usersMapper = (usersBd: WithId<UserDBModel>): UserViewModel => ({
    id: usersBd._id.toString(),
    login: usersBd.login,
    email: usersBd.email,
    createdAt: usersBd.createdAt
})
