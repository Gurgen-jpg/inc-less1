import {UserInputModel} from "../models/users/input";
import bcrypt from "bcrypt";
import {UserRepository} from "../repositories/users/user-repository";
import {UserQueryRepository} from "../repositories/users/user-query-repository";
import {UserViewModel} from "../models/users/output";
import {PaginationType, UserQueryModel} from "../models/common";
import {generateId} from "../adapters/uuid";
import {add} from "date-fns/add";

export class UsersService {
    static async createUser(payload: UserInputModel): Promise<UserViewModel | null> {
        const {login, email, password} = payload;
        const saltRound = 10;
        const createdAt = new Date().toISOString();
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
                accountData: {login,
                email,
                passwordHash: userHash,
                createdAt},
                emailConfirmation: {
                    confirmationCode: generateId(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 2
                    }),
                    isConfirmed: false
                },
            });
            if (!userId) {
                throw new Error('Error creating user');
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
