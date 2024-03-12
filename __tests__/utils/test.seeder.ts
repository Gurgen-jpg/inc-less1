import request from "supertest";
import {app} from "../../src/settings";


type AddUserData = { password: string, login: string, email: string };
type AuthUserDAta = { password: string, loginOrEmail: string, userAgent?: string };
export const testSeeder = {
    createUserDto() {
        return {
            login: 'test',
            password: '12345678',
            email: 'test@gmail.com'
        }
    },

    async mockSendMail(email: string, login: string, subject: string, code: string): Promise<boolean> {
        return true;
    },

    getRefreshToken(cookies: string) {
        let refreshToken;
        for (const cookie of cookies) {
            if (cookie.startsWith('refreshToken')) {
                const refreshTokenMatch = /refreshToken=(\w+)/.exec(cookie);
                if (refreshTokenMatch) {
                    refreshToken = refreshTokenMatch[1];
                    break;
                }
            }
        }
        return refreshToken;
    },

    async createUsers({login, password, email}: AddUserData) {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                login: 'login',
                email: 'user.email@mail.ru',
                password: 'password',
                createdAt: new Date().toISOString()
            })
        // const auth = await request(app)
        //     .post('/auth/login')
        //     .set({
        //         "user-agent": "jest",
        //     })
        //     .send({
        //         loginOrEmail: 'login',
        //         password: 'password'
        //     })
        return {login, password};
    },

    async authUser({password, loginOrEmail, userAgent = "jest"}: AuthUserDAta) {
        const auth = await request(app)
            .post('/auth/login')
            .set({
                "user-agent": userAgent,
            })
            .send({
                loginOrEmail,
                password
            });
        return {accessToken: auth.body.accessToken, refreshToken: auth.headers['set-cookie'], login: loginOrEmail, password};
    }
}


