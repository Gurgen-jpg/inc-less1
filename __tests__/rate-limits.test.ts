import request from "supertest";
import {app} from "../src/settings";
import {RateLimitRepository} from "../src/repositories/rateLimit-repository";

describe('rete limit in login', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('-should return 429 if too many requests', async () => {
        const users = Array.from({length: 5}, (el, index) => ({
            loginOrEmail: 'login' + index,
            password: 'password',
        }));
        await Promise.all(users.map(user => request(app).post('/auth/login').send(user)));
        const res = await request(app).post('/auth/login').send({
            loginOrEmail: 'login5',
            password: 'password',
        })
        expect(res.status).toBe(429);
        await new Promise(resolve => setTimeout(resolve, 11000));
        const res2 = await request(app).post('/auth/login').send({
            loginOrEmail: 'login5',
            password: 'password',
        })
        expect(res2.status).toBe(401);
    });

})
