import {LoginInputModel, RegisterInputModel} from "../models/auth/input";
import bcrypt from "bcrypt";
import {JwtService} from "../app/auth/jwt-service";
import {UserRepository} from "../repositories/users/user-repository";
import {UserQueryRepository} from "../repositories/users/user-query-repository";
import {UserViewModel} from "../models/users/output";
import {EmailAdapter} from "../adapters/email-adapter";
import {MAIL_USER} from "../adapters/env-config";


export class AuthService {
    static async login(payload: LoginInputModel): Promise<string | null> {
        const {loginOrEmail, password} = payload;
        try {
            const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail);
            if (!user) {
                throw new Error('user not found')
            } else {
                const isCredentialsCorrect = await bcrypt.compare(password, user.password);
                if (!isCredentialsCorrect) {
                    throw new Error('wrong password')
                } else {
                    return JwtService.createJWT(user);
                }
            }
        } catch (e) {
            console.error(e);
            return null
        }

    }

    static async me(userId: string): Promise<UserViewModel | null> {
        try {
            if (!userId) {
                throw new Error('Invalid token')
            }
            const user = await UserQueryRepository.getUserById(userId);
            if (!user) {
                throw new Error('bad user id maybe deleted user')
            }
            return user
        } catch (e) {
            console.error(e);
            return null
        }
    }

    static async registerConfirm(payload: RegisterInputModel) {
        const {login, email} = payload;
        const subject = 'Подтверждение регистрации'
        try {
            return await EmailAdapter.sendMail(email, login, subject)
        } catch (e) {
            console.error(e);
            return false
        }

    }
}
