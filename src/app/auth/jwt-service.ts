import dotenv from "dotenv";
import jwt from "jsonwebtoken";


export class JwtService {
    static async createJWT(userid: string, expiresIn: string): Promise<string | null> {
        try {
            dotenv.config();
            return jwt.sign({userId: userid}, process.env.SECRET_WORD!, {expiresIn: '10s'});
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

    static isTokenExpired(token: string) {
        try {
            const jwtPayload: any = jwt.verify(token, process.env.SECRET_WORD!);
            // console.log('jwtPayload', jwtPayload);
            const expirationTime = jwtPayload.exp * 1000; // Преобразование времени истечения в миллисекунды
            const currentTime = Date.now(); // Текущее время в миллисекундах
            return expirationTime < currentTime;
        } catch (e) {
            return null;
        }
    }
}
