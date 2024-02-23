import {LoginInputModel, RegisterInputModel} from "../models/auth/input";
import bcrypt from "bcrypt";
import {JwtService} from "../app/auth/jwt-service";
import {UserRepository} from "../repositories/users/user-repository";
import {UserQueryRepository} from "../repositories/users/user-query-repository";
import {UserViewModel} from "../models/users/output";
import {EmailAdapter} from "../adapters/email-adapter";
import {BcryptService} from "../app/auth/bcrypt-service";
import {StatusResultType} from "../models/common";
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

            const userLoginExist = await UserRepository.getUserByLoginOrEmail(login);
            const userEmailExist = await UserRepository.getUserByLoginOrEmail(email);

            if (userLoginExist) {
                return {
                    status: 400,
                    errors: {
                        errorsMessages: [
                            {
                                message: 'User already exists',
                                field: 'login'
                            }
                        ]
                    }
                }
            }
            if (userEmailExist) {
                return {
                    status: 400,
                    errors: {
                        errorsMessages: [
                            {
                                message: 'User already exists',
                                field: 'email'
                            }
                        ]
                    }
                }
            }

            const hash = await BcryptService.createHash(password);
            if (!hash) {
                throw new Error('Problem hashing password')
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
                // await UserRepository.deleteUser(userId);
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
                errors: {errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]}
            };
            if (user.emailConfirmation.confirmationCode !== emailCode) return {
                status: 400,
                errors: {
                    errorsMessages:
                        [{message: 'Bad confirmation code', field: 'Confirmation code'}]
                }
            };
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'Code was confirmed later', field: 'Confirmation code'}]},
                }
            }
            if (user.emailConfirmation.confirmationCode === emailCode && user.emailConfirmation.expirationDate < new Date()) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'Code expired', field: 'Confirmation code'}]},
                }
            }

            const confirm = await UserRepository.updateIsConfirmed(user._id, true);

            if (!confirm) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'Bad confirmation code', field: 'Confirmation code'}]}
                }
            }

            return {
                status: 204,
                message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
            }
        } catch (e) {
            console.error(e);
            return {status: 400, errors: {
                    errorsMessages: [{
                        message: 'Bad confirmation code',
                        field: 'Confirmation code'
                    }]
                }}
        }
    }


    static async resendEmail(email: string): Promise<StatusResultType> {
        try {
            const user = await UserRepository.getUserByLoginOrEmail(email);
            if (!user) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'User not found', field: 'Email'}]}
                }
            }
            if (user.emailConfirmation.isConfirmed) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'User already confirmed', field: 'Email'}]}
                }
            }


            const newCode = await UserRepository.updateConfirmationCode(generateId(), user._id);
            if (!newCode) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'User not found', field: 'Email'}]}
                }
            }
            const isSend = await EmailAdapter.sendMail(email, user.accountData.login, 'Подтверждение регистрации', newCode);
            if (!isSend) {
                return {
                    status: 400,
                    errors: {errorsMessages: [{message: 'User not found', field: 'Email'}]}
                }
            }
            return {
                status: 204,
                message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
            }
        } catch (e) {
            console.error(e);
            return {status: 400, errors: {errorsMessages: [{message: 'User not found', field: 'Email'}]}}
        }
    }
}
