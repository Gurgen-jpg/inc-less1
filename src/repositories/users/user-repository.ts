import {UserInputModel} from "../../models/users/input";
import {usersCollection} from "../../db/db";
import {InsertOneResult, ObjectId} from "mongodb";

export class UserRepository {
    static async createUser(payload: UserInputModel): Promise<string | null> {
        console.log('UserRepository')
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

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<string | null> {
        try {
            return await usersCollection
                .findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
                .then((user) => user ? user.password : null)
                .catch((err) => {
                    throw err
                });
        } catch (e) {
            console.log('can not find user', e);
            return null
        }
    }

    static async getAllUsers() {

    }
}
