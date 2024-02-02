import {UserInputModel} from "../../src/models/users/input";
import request from "supertest";
import {app} from "../../src/settings";

export async function createUsers(count: number) {
    const users: UserInputModel[] = Array.from({length: count},
        () => {
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes());
            return ({
                login: 'login',
                email: 'user.email@mail.com',
                password: 'password',
                createdAt: currentDate.toISOString()
            })
        }
    )
    const createdUsersPromises = users.map(async (user, id) => {
         await request(app)
            .post('/users')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({...user, login: user.login + id, password: user.password + id});
    });
    await Promise.all(createdUsersPromises);
}

