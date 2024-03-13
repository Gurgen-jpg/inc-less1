import {SessionRepository} from "../repositories/session-repository";
import {SessionDBModel} from "../models/session/session";
import {StatusResultType} from "../models/common";
import {SessionOutputType} from "../models/session/output";
import {JwtService} from "../app/auth/jwt-service";

type DeleteSessionsPayload = {
    deviceId?: string;
    refreshToken: string;
}

export class SessionService {
    static async getAllSessions(token: string): Promise<StatusResultType<SessionOutputType[] | null>> {
        const {userId} = JwtService.getPayload(token);
        try {
            const result = await SessionRepository.getAllSessions(userId);
            return {
                status: 200,
                data: result ? result : null,
                message: 'sessions found',
                errors: null
            }
        } catch (e) {
            console.log('Error in getAllSessions:', e);
            return {
                status: 401,
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
                status: 401,
                data: null,
                message: 'sessions not deleted',
                errors: null
            }
        }
    }

    static async deleteSession({deviceId, refreshToken}: DeleteSessionsPayload): Promise<StatusResultType<null>> {
        const tokenData = JwtService.getPayload(refreshToken);
        const deviceToDelete = deviceId ?? tokenData.deviceId;
        try {
            const checkSession =  await SessionRepository.checkSessionDevice({deviceId: deviceToDelete, userId: tokenData.userId});
            if (!checkSession) {
                return {
                    status: 403,
                    data: null,
                    message: 'forbidden',
                    errors: null
                }
            }
            const isSessionExist = await SessionRepository.findSession(deviceToDelete);
            if (!isSessionExist) {
                return {
                    status: 404,
                    data: null,
                    message: 'session not found',
                    errors: null
                }
            }
            const result = await SessionRepository.deleteSession({deviceId: deviceToDelete, userId: tokenData.userId});
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
