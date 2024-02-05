import request from "supertest";
import {app} from "../src/settings";
import {createUsers} from "./utils/createData";

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
            expect(response.body.token).toBeDefined();
            const token = response.body.token;
            const authedUser = await request(app)
                .get('/auth/me')
                .set({
                    Authorization: `Bearer ${token}`
                });
            expect(authedUser.status).toBe(200);
            expect(authedUser.body).toEqual({
                email: 'user.email@mail.com',
                login: user.loginOrEmail + id,
                id: expect.any(String)
            })
        })
        await Promise.all(authPromise);
    });
// todo: Спросить: как поступать с таим кейсом? описать в валидации а записать ошибку в errorsMessages или просто вернуть null или 403???
    it('-deleted user', async () => {
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
        expect(token.body.token).toBeDefined();
        // удалил юзера
        const deleteStatus = await request(app)
            .delete('/users/' + user.body.id)
            .set('Authorization', `Bearer ${token.body.token}`);
        expect(deleteStatus.status).toBe(204);
        // пробую авторизоваться с токеном удаленного юзера
        const authedUser = await request(app).get('auth/me').set({
            Authorization: `Bearer ${token.body.token}`
        })
        console.log(authedUser.body)

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


})
