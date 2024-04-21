import dotenv from "dotenv";
import jwt from "jsonwebtoken";


export class JwtService {
    static async createJWT(userid: string, expiresIn: string, deviceId?: string): Promise<string | null> {
        try {
            dotenv.config();
            return jwt.sign({
                userId: userid,
                iat: Math.floor(Date.now() / 1000),
                deviceId: deviceId,
            },  process.env.SECRET_WORD!, {expiresIn: "10d"});
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

static getPayload(token: string) {
        try {
            const jwtPayload: any = jwt.verify(token, process.env.SECRET_WORD!);
            return jwtPayload;
        } catch (e) {
            return null;
        }
    }

    static isTokenExpired(token: string) {
        try {
            const jwtPayload: any = jwt.verify(token, process.env.SECRET_WORD!);
            // const expirationTime = jwtPayload.exp * 1000; // Преобразование времени истечения в миллисекунды
            // const currentTime = Date.now(); // Текущее время в миллисекундах
            // return expirationTime < currentTime;
            return false;
        } catch (error: any) {
            if (error instanceof jwt.TokenExpiredError) {
                // Если токен просрочен, выводим сообщение об ошибке
                console.error('Токен просрочен');
                console.error('Истекло время: ', error.expiredAt); // Время истечения токена
            } else {
                // Если произошла другая ошибка, выводим ее сообщение
                console.error('Произошла ошибка при проверке токена:', error.message);
            }
            return true;
        }
    }
}
