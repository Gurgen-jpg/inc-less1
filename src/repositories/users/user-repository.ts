import {UserInputModel} from "../../models/users/input";
import {usersCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserAuthViewModel} from "../../models/users/output";
import {UserDBModel} from "../../models/db";

export class UserRepository {
    static async createUser(user: UserDBModel): Promise<string | null> {
        try {
            return await usersCollection.insertOne(user)
                .then((id) => {
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

    static async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBModel> | null> {
        try {
            return await usersCollection
                .findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
                .then((user) => {
                    return user ? user : null
                })
                .catch((err) => {
                    throw err
                });
        } catch (e) {
            console.log('can not find user', e);
            return null
        }
    }

    static async getUserById(id: string): Promise<WithId<UserDBModel> | null> {
        try {
            return await usersCollection.findOne({_id: new ObjectId(id)});
        } catch (e) {
            return null
        }
    }

    static async confirmEmail(confirmationCode: string): Promise<WithId<UserDBModel> | null> {
        try {
            const user = await usersCollection.findOne({
                'emailConfirmation.confirmationCode': confirmationCode
            });
            if (!user) {
                return null
            }
            return user
        } catch (e) {
            console.log(e);
            return null
        }
    }

    static async updateIsConfirmed(userId: ObjectId): Promise<Boolean> {
        try {
            const res = await usersCollection.updateOne({_id: userId}, {$set: {'emailConfirmation.isConfirmed': true}});
            if (res && res.modifiedCount === 1) {
                return true
            }
            return false
        } catch (e) {
            return false
        }
    }

    static async updateConfirmationCode(code: string, userId: ObjectId) {
        try {
            const result = await usersCollection.updateOne({_id: userId}, {$set: {'emailConfirmation.confirmationCode': code}});
            if (result.modifiedCount === 1) {
                return code;
            }
            return null
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
