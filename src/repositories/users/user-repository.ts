import {UserInputModel} from "../../models/users/input";
import {usersCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserAuthViewModel} from "../../models/users/output";
import {UserDBModel} from "../../models/db";

export class UserRepository {
    static async createUser(payload: UserInputModel): Promise<string | null> {
        const {login, email, password, createdAt} = payload;
        try {
            return await usersCollection.insertOne({login, email, password, createdAt}).then((id) => {
                if (!id) {
                    return null
                }
                return id.insertedId.toString()
            });
        } catch (e) {
            return null
        }
    }

    static async deleteUser(id: string): Promise<Boolean> {
        try {
            const deleteResult = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return deleteResult.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserAuthViewModel | null> {
        try {
            return await usersCollection
                .findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
                .then((user) => {
                    return user ? {
                        id: user._id.toString(),
                        login: user.login,
                        email: user.email,
                        password: user.password,
                    } : null
                })
                .catch((err) => {
                    throw err
                });
        } catch (e) {
            console.log('can not find user', e);
            return null
        }
    }

    static async getUserById(id: string): Promise<WithId<UserDBModel> | null>  {
        try {
            return await usersCollection.findOne({_id: new ObjectId(id)});
        } catch (e) {
            return null
        }
    }
}
