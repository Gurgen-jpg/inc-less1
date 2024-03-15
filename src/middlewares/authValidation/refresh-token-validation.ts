import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import { HTTP_STATUSES} from "../../models/common";
import {JwtService} from "../../app/auth/jwt-service";
import {AuthRepository} from "../../repositories/auth-repository";
import {SessionRepository} from "../../repositories/session-repository";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    dotenv.config();
    const cookie = req.cookies.refreshToken;
    if (!cookie) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }
    const isTokenExpired = JwtService.isTokenExpired(cookie);
    const tokenData = JwtService.getPayload(cookie)
    const isTokenInBlackList = await AuthRepository.isTokenBlacklisted(cookie);
    const isSessionExist = await SessionRepository.getSessionByDeviceId(tokenData.deviceId);
    if (isTokenExpired || isTokenInBlackList || !isSessionExist) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }

    return next();

}
