import request from "supertest";
import {app} from "../src/settings";

describe('rete limit in login', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('-should return 429 if too many requests', async () => {
        const users = Array.from({length: 6}, (el, index) => ({
            loginOrEmail: 'login' + index,
            password: 'password',
        }));
        await Promise.all(users.map(user => request(app).post('/auth/login').send(user)));
        const res = await request(app).post('/auth/login').send({
            loginOrEmail: 'login5',
            password: 'password',
        })
        expect(res.status).toBe(429);


    });

})
