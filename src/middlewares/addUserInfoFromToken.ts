import {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import {JwtService} from "../app/auth/jwt-service";
export const addUserInfoFromToken = (req: Request, res: Response, next: NextFunction) => {

    dotenv.config();
    const auth = req.headers['authorization'];
    if (auth === undefined) {
        return next();
    }
    const [authType, token] = auth.split(' ');
    if (authType !== 'Bearer') {
        return next();
    }
    const {userId, deviceId, iat, exp} = JwtService.verifyJWT(token);
    if (userId === undefined) {
        return next();
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
    return next()
}
