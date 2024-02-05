import {Request, Response, NextFunction} from "express";
import {AUTH_TYPES, HTTP_STATUSES} from "../../models/common";


export const basicAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const [authType, token] = auth.split(' ');

    if (authType !== AUTH_TYPES.BASIC) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const [login, password] = Buffer.from(token, 'base64').toString().split(':');
    if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }
    return next();

}
