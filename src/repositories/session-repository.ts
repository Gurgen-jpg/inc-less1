import {sessionCollection} from "../db/db";
import {SessionDBModel} from "../models/session/session";
import {mapper} from "../models/session/napper/mapper";
import {SessionOutputType} from "../models/session/output";

export class SessionRepository {
    static async getAllSessions(userId: string): Promise<SessionOutputType[] | null> {
        try {
            const result = await sessionCollection.find({userId}).toArray();
            return result.map(mapper);
        } catch (e) {
            console.log('Error in getAllSessions:', e);
            return null
        }
    }
    static async createSession(session: SessionDBModel) {
        try {
            const result = await sessionCollection.insertOne(session);
        } catch (e) {
            console.log('Error in createSession:', e);
        }
    }

    static async updateSession(deviceId: string,session: SessionDBModel) {
        try {
            const result = await sessionCollection.updateOne({
                deviceId: session.deviceId
            }, {$set: session});
        } catch (e) {
            console.log('Error in updateSession:', e);
        }
    }

    static async deleteAllSessions(deviceId: string) {
        try {
            const result = await sessionCollection.deleteMany({deviceId});
        } catch (e) {
            console.log('Error in deleteAllSessions:', e);
        }
    }

    static async deleteSession(deviceId: string) {
        try {
            const result = await sessionCollection.deleteOne({deviceId});
        } catch (e) {
            console.log('Error in deleteSession:', e);
        }
    }
}
