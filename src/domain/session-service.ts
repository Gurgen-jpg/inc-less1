import {SessionRepository} from "../repositories/session-repository";
import {SessionDBModel} from "../models/session/session";
import {StatusResultType} from "../models/common";

export class SessionService {
    static async getAllSessions(userId: string): Promise<StatusResultType<SessionDBModel[] | null>> {
        try {
            const result = await SessionRepository.getAllSessions(userId);
            return {
                status: 200,
                data: result,
                message: 'sessions found',
                errors: null
            }
        } catch (e) {
            console.log('Error in getAllSessions:', e);
            return {
                status: 500,
                data: null,
                message: 'sessions not found',
                errors: null
            }
        }
    }

    static async deleteAllSessions(deviceId: string): Promise<StatusResultType<null>> {
        try {
            const result = await SessionRepository.deleteAllSessions(deviceId);
            return {
                status: 204,
                data: null,
                message: 'sessions deleted',
                errors: null
            }

        } catch (e) {
            console.log('Error in deleteAllSessions:', e);
            return {
                status: 500,
                data: null,
                message: 'sessions not deleted',
                errors: null
            }
        }
    }

    static async deleteSession(deviceId: string): Promise<StatusResultType<null>> {
        try {
            const result = await SessionRepository.deleteSession(deviceId);
            return {
                status: 204,
                data: null,
                message: 'session deleted',
                errors: null
            }
        } catch (e) {
            console.log('Error in deleteSession:', e);
            return {
                status: 500,
                data: null,
                message: 'session not deleted',
                errors: null
            }
        }
    }
}
