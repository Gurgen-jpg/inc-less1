import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../models/common";
import dotenv from 'dotenv';
import {JwtService} from "../../app/auth/jwt-service";
import {UserViewModel} from "../../models/users/output";

enum AUTH_TYPES {
    BASIC = 'Basic',
    BEARER = 'Bearer'
}

dotenv.config();
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const [authType, token] = auth.split(' ');
    if (authType !== AUTH_TYPES.BASIC && authType !== AUTH_TYPES.BEARER) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    if (authType === AUTH_TYPES.BASIC) {
        const [login, password] = Buffer.from(token, 'base64').toString().split(':');
        if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
            return
        }
        return next();
    }

    if (authType === AUTH_TYPES.BEARER) {
        const userId =  JwtService.verifyJWT(token);
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
}
