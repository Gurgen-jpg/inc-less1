import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../models/common";
import dotenv from 'dotenv';

dotenv.config();
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return
    }

    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
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
