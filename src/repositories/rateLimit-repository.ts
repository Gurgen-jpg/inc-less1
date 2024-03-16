import {rateLimitCollection} from "../db/db";
import {RateLimitModel} from "../models/rateLimit/RateLimitModel";
import {InsertOneResult} from "mongodb";

export class RateLimitRepository {

    static async createRateLimit(rateLimit: RateLimitModel): Promise<InsertOneResult<RateLimitModel> | null> {
        try {
            return await rateLimitCollection.insertOne(rateLimit);
        }catch (e) {
            return null
        }
    }

    static async count(ip: string, url: string): Promise<number | null> {
        const currentDateMinus10Seconds = new Date(Date.now() - 10000);

        try {
            return await rateLimitCollection.countDocuments({ip, url, date: {$lte: currentDateMinus10Seconds}});
        } catch (e) {
            return null
        }
    }
}
