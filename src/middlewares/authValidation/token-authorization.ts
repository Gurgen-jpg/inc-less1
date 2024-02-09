import {Request, Response, NextFunction} from "express";
import {JwtService} from "../../app/auth/jwt-service";
import {AUTH_TYPES, HTTP_STATUSES} from "../../models/common";
import dotenv from "dotenv";

export const tokenAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    dotenv.config();
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const [authType, token] = auth.split(' ');
    if (authType !== AUTH_TYPES.BEARER) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    const userId = JwtService.verifyJWT(token);
    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    req.context = {
        user: {
            id: userId
        }
    };
    return next();

}