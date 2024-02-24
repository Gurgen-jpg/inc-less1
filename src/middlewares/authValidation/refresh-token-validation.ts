import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {AUTH_TYPES, HTTP_STATUSES} from "../../models/common";
import {JwtService} from "../../app/auth/jwt-service";

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    dotenv.config();
    const cookie = req.cookies.refreshToken;
    if (!cookie) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const isTokenExpired = JwtService.isTokenExpired(cookie);
    if (isTokenExpired) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    return next();

}
