import request from "supertest";
import {app} from "../src/settings";
import {createUsers} from "./utils/createData";
import {testSeeder} from "./utils/test.seeder";
import {cookie} from "express-validator";
import {describe} from "node:test";

describe('auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });

    const loginData = Array.from({length: 5}, () => ({
            loginOrEmail: 'login',
            password: 'password',
        })
    );

    it('+login', async () => {
        // создал пользователей
        await createUsers(5);
        // авторизовал всех пользователей, передал им токен, и сделал запрос за данными от имени каждого пользователя
        const authPromise = loginData.map(async (user, id) => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: user.loginOrEmail + id,
                    password: user.password + id
                });
            expect(response.status).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            const token = response.body.accessToken;
            // console.log('token', token);
            const authedUser = await request(app)
                .get('/auth/me')
                .set({
                    Authorization: `Bearer ${token}`
                });
            expect(authedUser.status).toBe(200);
            expect(authedUser.body).toEqual({
                email: 'user.email@mail.com',
                login: user.loginOrEmail + id,
                userId: expect.any(String),
            })
        })
        await Promise.all(authPromise);
    });

    it('+deleted user', async () => {
        // создал юзера
        const user = await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: 'BadUser',
                password: 'password',
                email: 'user.email@mail.com'
            });
        expect(user.status).toBe(201);
        // получил токен
        const token = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'BadUser',
                password: 'password'
            })
        expect(token.status).toBe(200);
        expect(token.body.accessToken).toBeDefined();
        // удалил юзера
        const deleteStatus = await request(app)
            .delete('/users/' + user.body.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(deleteStatus.status).toBe(204);
        // пробую авторизоваться с токеном удаленного юзера
        const authedUser = await request(app).get('auth/me').set({
            Authorization: `Bearer ${token.body.accessToken}`
        })
        expect(authedUser.status).toBe(404);

    })

    it('-login validation bad password', async () => {
        const authPromise = loginData.map(async (user, id) => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: user.loginOrEmail + id,
                    password: user.password + id + 'error'
                });
            expect(response.status).toBe(401);
        })
        await Promise.all(authPromise);
    })

    it('-login validation bad login', async () => {
        const authPromise = loginData.map(async (user, id) => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: user.loginOrEmail + id + 'error',
                    password: user.password + id
                });
            expect(response.status).toBe(401);
        })
        await Promise.all(authPromise);
    })

    it('-get auth/me, expired token', async () => {
        await request(app).delete('/testing/all-data');
        const user = await request(app).post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: 'login',
                password: 'password',
                email: 'user.email@mail.com'
            })
        const response = await request(app).post('/auth/login').send({
            loginOrEmail: 'login',
            password: 'password',
        })
        console.log(response.body);

        const [header, payload, signature] = response.body.accessToken.split('.');
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
        const exp = decodedPayload.exp;

        // console.log(exp * 1000 - Date.now());

        await new Promise(resolve => setTimeout(resolve, 15000));


        const authedUser = await request(app)
            .get('/auth/me')
            .set({
                Authorization: `Bearer ${response.body.accessToken}`
            });

        expect(authedUser.status).toBe(401);

    })

    it('+refresh token', async () => {
        await request(app).delete('/testing/all-data');
        const user = await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: 'login',
                password: 'password',
                email: 'user.email@mail.com'
            });
        const login = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'login',
                password: 'password',
            });

        // Проверяем, что в ответе есть куки
        expect(login.headers['set-cookie']).toBeDefined();

        // Получаем массив кук из заголовка Set-Cookie
        const cookies = login.headers['set-cookie'];

        // Проверяем каждую куку на наличие refreshToken и флага HttpOnly
        let refreshTokenCookieFound = false;
        for (const cookie of cookies) {
            if (cookie.startsWith('refreshToken') && cookie.includes('HttpOnly')) {

                refreshTokenCookieFound = true;
                break;
            }
        }

        expect(refreshTokenCookieFound).toBe(true);

        // достать рефреш токен и аксес токен
        const oldRefreshToken = testSeeder.getRefreshToken(cookies);
        const oldAccessToken = login.body.accessToken?.split('.')[2];

        // обновим токены
        const refresh = await request(app)
            .post('/auth/refresh-token')
            .set({
                Cookie: cookies
            })

        // Проверяем, что в ответе есть куки
        expect(refresh.status).toBe(200);
        expect(refresh.headers['set-cookie']).toBeDefined();
        expect(refresh.headers['set-cookie']).toHaveLength(1);
    });

    it('-refresh token is expired', async () => {
        await request(app).delete('/testing/all-data');
        const user = await request(app).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({
            login: 'login',
            password: 'password',
            email: 'user.email@mail.com'
        });
        const login = await request(app).post('/auth/login').send({
            loginOrEmail: 'login',
            password: 'password',
        });
        const cookies = login.headers['set-cookie'];
        const oldRefreshToken = testSeeder.getRefreshToken(cookies);
        await new Promise(resolve => setTimeout(resolve, 8000));
        const refresh = await request(app).post('/auth/refresh-token').set({
            Cookie: cookies
        })
        expect(refresh.status).toBe(401);
    });


});
