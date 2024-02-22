import dotenv from "dotenv";
import jwt from "jsonwebtoken";


export class JwtService {
    static async createJWT(userid: string): Promise<string | null> {
        try {
            dotenv.config();
            return jwt.sign({userId: userid}, process.env.SECRET_WORD!, {expiresIn: '24h'});
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
