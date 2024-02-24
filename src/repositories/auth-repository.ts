import {tokenCollection} from "../db/db";

export class AuthRepository {
    static async isTokenBlacklisted(token: string): Promise<boolean> {
        const tokenBlackList = await tokenCollection.findOne({token});
        return !!tokenBlackList;
    }

    static async addTokenToBlackList(token: string): Promise<boolean> {
        const result = await tokenCollection.insertOne({token});
        return result.acknowledged;
    }

}
