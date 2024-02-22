import {LoginInputModel, RegisterInputModel} from "../models/auth/input";
import bcrypt from "bcrypt";
import {JwtService} from "../app/auth/jwt-service";
import {UserRepository} from "../repositories/users/user-repository";
import {UserQueryRepository} from "../repositories/users/user-query-repository";
import {UserViewModel} from "../models/users/output";
import {EmailAdapter} from "../adapters/email-adapter";
import {BcryptService} from "../app/auth/bcrypt-service";
import {StatusResultType} from "../models/common";
import {ObjectId} from "mongodb";
import {add} from "date-fns/add";
import {generateId} from "../adapters/uuid";


export class AuthService {
    static async login(payload: LoginInputModel): Promise<string | null> {
        const {loginOrEmail, password} = payload;
        try {
            const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail);
            if (!user) {
                throw new Error('user not found')
            } else {
                const isCredentialsCorrect = await bcrypt.compare(password, user.accountData.passwordHash);
                if (!isCredentialsCorrect) {
                    throw new Error('wrong password')
                } else {
                    return JwtService.createJWT(user._id.toString());
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

    static async register(payload: RegisterInputModel): Promise<StatusResultType | null> {
        const {login, email, password} = payload;
        try {
            const hash = await BcryptService.createHash(password);
            if (!hash) {
                throw new Error('Problem hashing password')
            }

            const correctLogin = await UserRepository.getUserByLoginOrEmail(login);
            const correctEmail = await UserRepository.getUserByLoginOrEmail(email);

            if (correctLogin || correctEmail) {
                throw new Error('User already exists')
            }

            const userId = await UserRepository.createUser({
                accountData: {
                    login,
                    email,
                    passwordHash: hash,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: generateId(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 2
                    }),
                    isConfirmed: false
                },
            })
            if (!userId) {
                throw new Error('Error creating user')
            }
            try {
                const user = await UserRepository.getUserById(userId);
                if (!user) {
                    throw new Error('bad user id maybe deleted user')
                }
                await EmailAdapter.sendMail(email, login, 'Подтверждение регистрации', user.emailConfirmation.confirmationCode)
            } catch (e) {
                console.error(e);
                await UserRepository.deleteUser(userId);
            }
            return {
                status: 204,
                message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
            }
        } catch (e) {
            console.error(e);
            return null
        }
    }

    static async confirmEmail(emailCode: string): Promise<StatusResultType> {
        try {
            const user = await UserRepository.confirmEmail(emailCode);
            if (!user) return {
                status: 400,
                errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]
            };
            if (user.emailConfirmation.confirmationCode !== emailCode) return {
                status: 400,
                errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]
            };
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: 400,
                    errorsMessages: [{message: 'Code was confirmed later', field: 'Confirmation code'}],
                }
            }
            if (user.emailConfirmation.confirmationCode === emailCode && user.emailConfirmation.expirationDate < new Date()) {
                return {
                    status: 400,
                    errorsMessages: [{message: 'Code expired', field: 'Confirmation code'}],
                }
            }

            const confirm = await UserRepository.updateConfirmationCode(user._id);

            if (!confirm) {
                return {
                    status: 400,
                    errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]
                }
            }

            return {
                status: 204,
                message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
            }
        } catch (e) {
            console.error(e);
            return {status: 400, errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]}
        }
    }


    static async resendEmail(email: string): Promise<StatusResultType> {
        try {
            const user = await UserRepository.getUserByLoginOrEmail(email);
            if (!user) {
                return {
                    status: 400,
                    errorsMessages: [{message: 'User not found', field: 'Email'}]
                }
            }
            await EmailAdapter.sendMail(email, user.accountData.login, 'Подтверждение регистрации', user.emailConfirmation.confirmationCode);
            return {
                status: 204,
                message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
            }
        } catch (e) {
            console.error(e);
            return {status: 400, errorsMessages: [{message: 'User not found', field: 'Email'}]}
        }
    }
}
