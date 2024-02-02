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
        await createUsers(5);
        const authPromise = loginData.map(async (user, id) => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: user.loginOrEmail + id,
                    password: user.password + id
                });
            expect(response.status).toBe(204);
        })
        await Promise.all(authPromise);
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
