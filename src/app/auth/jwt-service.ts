import dotenv from "dotenv";
import {UserAuthViewModel} from "../../models/users/output";
import jwt from "jsonwebtoken";


export class JwtService {
    static async createJWT(user: UserAuthViewModel): Promise<string | null> {
        try {
            dotenv.config();
            return jwt.sign({userId: user.id}, process.env.SECRET_WORD!, {expiresIn: '24h'});
        } catch (e) {
            console.error('Error creating JWT:', e);
            return null
        }
    }

    static verifyJWT(token: string) {
        try {
            const jwtPayload: any = jwt.verify(token, process.env.SECRET_WORD!);
            return jwtPayload.userId;
        } catch (e) {
            return null;
        }
    }
}
