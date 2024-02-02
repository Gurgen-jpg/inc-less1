import {UserInputModel, UserQueryModel} from "../models/users/input";
import bcrypt, {hash} from "bcrypt";
import {UserRepository} from "../repositories/users/user-repository";
import {UserQueryRepository} from "../repositories/users/user-query-repository";
import {Users, UserViewModel} from "../models/users/output";
import {PaginationType} from "../models/common";

export class UsersService {
    static async createUser(payload: UserInputModel): Promise<UserViewModel | null> {
        const {login, email, password} = payload;
        const saltRound = 10;
        const createdAt = new Date().toISOString();
        // let userHash = ''
        try {
            const userHash: string = await new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRound, (err, hash) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        throw err
                    }
                    resolve(hash);
                });
            });
            const userId = await UserRepository.createUser({
                login,
                email,
                password: userHash,
                createdAt
            });
            if (!userId) {
                throw new Error('Error creating user');
                return null
            }
            return await UserQueryRepository.getUserById(userId);
        } catch (e) {
            console.log(e);
            return null
        }
    }

    static async getAllUsers(query: Partial<UserQueryModel>): Promise<PaginationType<UserViewModel> | null> {
        const sortData: UserQueryModel = {
            sortBy: query.sortBy ?? 'createdAt',
            sortDirection: query.sortDirection ?? 'desc',
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize ? +query.pageSize : 10,
            searchLoginTerm: query.searchLoginTerm ?? null,
            searchEmailTerm: query.searchEmailTerm ?? null
        }
        try {
            return await UserQueryRepository.getAllUsers(sortData);
        } catch (e) {
            return null
        }
    }

    static async deleteUser(id: string): Promise<Boolean> {
        try {
            return await UserRepository.deleteUser(id);
        } catch (e) {
            return false
        }
    }
}
