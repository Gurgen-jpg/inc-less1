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

    if (authType === AUTH_TYPES.BASIC) {
        req.context = {
            user: {
                id: 'admin'
            },
            session: {
                deviceId: "admin device",
                lastActiveDate: Date.now().toString(),
                expirationDate: Date.now().toString() + 5000
            }
        };
        return next();
    }

    if (authType !== AUTH_TYPES.BEARER) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    const {userId, deviceId, iat, exp} = JwtService.verifyJWT(token);
    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    const isTokenExpired = JwtService.isTokenExpired(token);
    if (isTokenExpired) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    req.context = {
        user: {
            id: userId
        },
        session: {
            deviceId,
            lastActiveDate: iat,
            expirationDate: exp
        }
    };
    return next();

}
