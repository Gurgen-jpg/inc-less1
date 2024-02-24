import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import { HTTP_STATUSES} from "../../models/common";
import {JwtService} from "../../app/auth/jwt-service";

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    dotenv.config();
    const cookie = req.cookies.refreshToken;
    const isTokenExpired = JwtService.isTokenExpired(cookie);
    if (isTokenExpired) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }

    return next();

}
