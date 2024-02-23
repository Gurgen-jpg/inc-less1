import {AuthService} from "../src/domain/auth-service";
import {testSeeder} from "./utils/test.seeder";
import {EmailAdapter} from "../src/adapters/email-adapter";
import request from "supertest";
import {app} from "../src/settings";
import {UserRepository} from "../src/repositories/users/user-repository";
import {ObjectId} from "mongodb";

describe('registration Service', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })

    const registerMethod = AuthService.register;
    // EmailAdapter.sendMail = testSeeder.mockSendMail;
    EmailAdapter.sendMail = jest.fn().mockResolvedValue((login: string, email: string, subject: string, code: string) => true);

    it('+should send email', async () => {
        const {login, email, password} = testSeeder.createUserDto();
        const result = await registerMethod({login, email, password});

        expect(EmailAdapter.sendMail).toBeCalled();

        expect(result).toEqual({
            status: 204,
            message: 'Input data is accepted. Email with confirmation code will be send to passed email address'
        });
    })

    it('-should not send email, user is existed', async () => {
        const {login, email, password} = testSeeder.createUserDto();
        await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({login, email, password});

        const newUser = await registerMethod({login, email, password});
        expect(newUser?.status).toBe(400);
    })

    it('+should not send email with new code, user is existed, but not confirmed', async () => {
        await request(app).delete('/testing/all-data');
        const {login, email, password} = testSeeder.createUserDto();
        const user = await request(app).post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({login, email, password});

        await UserRepository.updateIsConfirmed(new ObjectId(user.body.id), false);

        await request(app).post('/auth/registration').send({login, email, password});

        const resend = await request(app).post('/auth/registration-email-resending').send({email});

        expect(resend.status).toBe(204);

        console.log(resend.body)


    })
})

describe('Registration Controller', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('-should not send email, user is existed', async () => {
        const {login, email, password} = testSeeder.createUserDto();
        await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({login, email, password});


        const newUser = await request(app)
            .post('/auth/registration')
            .send({login, email, password});

        expect(newUser.status).toBe(400);
        console.log(newUser.body)
        expect(newUser.body).toEqual([{
            message: 'User already exists',
            field: 'loginOrEmail'
        }])
    })


})
