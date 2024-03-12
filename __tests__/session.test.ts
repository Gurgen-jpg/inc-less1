import {testSeeder} from "./utils/test.seeder";
import request from "supertest";
import {app} from "../src/settings";

describe('check sessions flow', () => {

    beforeEach(async () => {
        await request(app).delete('/testing/all-data');
    });
    test('users should be deleted', async () => {
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
        const auth = await request(app)
            .post('/auth/login')
            .set({
                "user-agent": "jest",
            })
            .send({
                loginOrEmail: 'login',
                password: 'password'
            })
        expect(auth.status).toBe(200);
        const cookies = auth.headers['set-cookie']
        const refreshToken = testSeeder.getRefreshToken(cookies);
        expect.setState({refreshToken: refreshToken});

        let devices = await request(app).get('/security/devices').set({
            Cookie: cookies
        });
        expect(devices.status).toBe(200);
        expect(devices.body).toHaveLength(1);
        expect(devices.body[0].deviceId).toBeDefined();
        expect(devices.body[0].title).toBe('jest');
    });

    test('logout 1 device', async () => {
        // const addUser = await testSeeder.createUsers({
        //     login: 'login1',
        //     password: 'password1',
        //     email: 'user.email@mail.ru'
        // });
        // console.log('user', addUser)
        // const auth = await testSeeder.authUser({
        //     userAgent: "jest1", password: addUser.password, loginOrEmail: addUser.login});
        //     // const devices = await request(app).get('/security/devices').set({
        //     //     Cookie: `refreshToken=${auth.refreshToken}`
        //     // })
        //     console.log(auth)
        //
        // })
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
        const auth = await request(app)
            .post('/auth/login')
            .set({
                "user-agent": "jest",
            })
            .send({
                loginOrEmail: 'login',
                password: 'password'
            });
        const auth1 = await request(app)
            .post('/auth/login')
            .set({
                "user-agent": "jest1",
            })
            .send({
                loginOrEmail: 'login',
                password: 'password'
            });
        const auth2 = await request(app)
            .post('/auth/login')
            .set({
                "user-agent": "jest2",
            })
            .send({
                loginOrEmail: 'login',
                password: 'password'
            });
        const devices = await request(app).get('/security/devices').set({
            Cookie: auth2.headers['set-cookie']
        })
        expect(devices.status).toBe(200);
        expect(devices.body).toHaveLength(3);

        const logout = await request(app).post('/auth/logout').set({
            Cookie: auth1.headers['set-cookie'],
        });
        expect(logout.status).toBe(204);
        const devices2 = await request(app).get('/security/devices').set({
            Cookie: auth2.headers['set-cookie']
        });
        expect(devices2.body).toHaveLength(2);
    });
})
