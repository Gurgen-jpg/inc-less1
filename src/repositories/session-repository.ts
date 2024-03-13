import {sessionCollection} from "../db/db";
import {SessionDBModel, UpdateSearchParams} from "../models/session/session";
import {mapper} from "../models/session/napper/mapper";
import {SessionOutputType} from "../models/session/output";
import {DeleteResult} from "mongodb";

type DeleteSessionsPayload = {
    deviceId: string;
    userId?: string;
}

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

    static async updateSession(params: UpdateSearchParams, session: SessionDBModel) {
        try {
            const result = await sessionCollection.updateOne({
                deviceId: params.deviceId,
                title: params.title
            }, {$set: session});
        } catch (e) {
            console.log('Error in updateSession:', e);
        }
    }

    static async deleteAllSessions(deviceId: string) {
        try {
            const result = await sessionCollection.deleteMany({deviceId: {$ne: deviceId}});
        } catch (e) {
            console.log('Error in deleteAllSessions:', e);
        }
    }

    static async deleteSession({deviceId}: DeleteSessionsPayload): Promise<DeleteResult | null> {
        try {
            const result = await sessionCollection.deleteOne({deviceId});
            return result
        } catch (e) {
            console.log('Error in deleteSession:', e);
            return null;
        }
    }

    static async checkSessionDevice({deviceId, userId}: DeleteSessionsPayload) {
        const checkSession = await sessionCollection.findOne({deviceId, userId});
        return checkSession;
    }

    static async getSessionByDeviceId(deviceId: string) {
        return await sessionCollection.findOne({deviceId});
    }

    static async findSession(deviceId: string) {
        try {
            const result = await sessionCollection.findOne({deviceId});
            return result
        } catch (e) {
            console.log('Error in findSession:', e);
            return null
        }
    }
}
