import request from "supertest";
import {app} from "../src/settings";
import jwt from "jsonwebtoken";

describe("comment-like", () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    const auth = 'YWRtaW46cXdlcnR5';
    test("вернуть массив с комментариями, который содержит лайки", async () => {
        await request(app).post('/users').set('Authorization', `Basic ${auth}`).send({
            login: 'login',
            password: 'password',
            email: 'email@mail.ru'
        })

        const login = await request(app).post('/auth/login').send({
            loginOrEmail: 'login',
            password: 'password'
        });
        let tok = jwt.verify(login.body.accessToken, process.env.SECRET_WORD!)
        console.log(tok)


        const addNewBlog = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'name3',
                description: 'description3',
                websiteUrl: 'https://ZCFGd.Y38aOX9Fthor'
            })

        const newPost = await request(app).post('/posts')
            .set('Authorization', `Basic ${auth}`)
            .send({
                "title": "string",
                "shortDescription": "string",
                "content": "string tut content",
                "blogId": addNewBlog.body.id
            })

        const com = await request(app).post(`/posts/${newPost.body.id}/comments`)
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                "content": "Content for comment"
            })
        console.log(com.status)
        const comments = await request(app).get(`/posts/${newPost.body.id}/comments`)
        console.log(comments.body)
    })
})
