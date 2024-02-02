import request from "supertest";
import {app} from "../src/settings";
import {createUsers} from "./utils/createData";
import {UserViewModel} from "../src/models/users/output";
import {ErrorType} from "../src/models/common";

describe('users', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('+add user', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                login: 'login',
                email: 'user.email@mail.ru',
                password: 'password',
                createdAt: new Date().toISOString()
            })
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(String),
            login: 'login',
            email: 'user.email@mail.ru',
            createdAt: expect.any(String),
        })
        expect.setState({userId: response.body.id});
    });

    it('-add user', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                login: 'l',
                email: 'user.email-mail.ru',
                password: 'pass',
                createdAt: new Date().toISOString()
            })
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toBeInstanceOf(Array<ErrorType>)
        expect(response.body.errorsMessages).toHaveLength(3);
    })

    it('+delete user', async () => {
        const id = expect.getState().userId;
        const res = await request(app)
            .delete(`/users/${id}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`);

        expect(res.status).toBe(204);
        const res2 = await request(app)
            .get('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`);
        expect(res2.body.items).toHaveLength(0);
    })
    it('+get all users', async () => {
        await createUsers(5);
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`);
        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(5);
        expect(response.body.items).toBeInstanceOf(Array<UserViewModel>);
    })

})
