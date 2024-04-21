import request from "supertest";
import {app} from "../src/settings";

describe("comment-like", () => {
    const auth = 'YWRtaW46cXdlcnR5';
    test("вернуть массив с комментариями, который содержит лайки",async () => {
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
            // .set('Authorization', `Basic ${auth}`)
            .send({
            "content": "Content for comment"
        })
        console.log(com.status)
        const comments = await request(app).get(`/posts/${newPost.body.id}/comments`)
        console.log(comments.body)
    })
})
