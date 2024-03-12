import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import { HTTP_STATUSES} from "../../models/common";
import {JwtService} from "../../app/auth/jwt-service";
import {AuthRepository} from "../../repositories/auth-repository";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    dotenv.config();
    const cookie = req.cookies.refreshToken;
    const isTokenExpired = JwtService.isTokenExpired(cookie);
    const isTokenInBlackList = await AuthRepository.isTokenBlacklisted(cookie);
    if (isTokenExpired || isTokenInBlackList) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }

    return next();

}
