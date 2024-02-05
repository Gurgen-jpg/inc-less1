import {app} from "../src/settings";
import {testExpectedBlog} from "./blogs.test";
import request from "supertest";
import {createUsers} from "./utils/createData";

describe('testing delete all data', () => {
    it('delete all data', async () => {
        await request(app).post('/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({...testExpectedBlog})
        await request(app).post('/posts')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: '123df',
            })
        await createUsers(5);


        const response = await request(app).delete('/testing/all-data');
        const blogs = await request(app).get('/blogs');
        const posts = await request(app).get('/posts');
        const users = await request(app).get('/users').set('Authorization', `Basic YWRtaW46cXdlcnR5`);
        expect(response.status).toBe(204);
        expect(blogs.status).toBe(200);
        expect(blogs.body.items).toHaveLength(0);
        expect(posts.status).toBe(200);
        expect(posts.body.items).toHaveLength(0);
        expect(users.status).toBe(200);
        expect(users.body.items).toHaveLength(0);

    })

})
