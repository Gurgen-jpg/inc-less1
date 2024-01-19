import {app} from "../src/settings";
import request from "supertest";
import {testExpectedBlog} from "./blogs.test";
import dotenv from "dotenv";

dotenv.config();
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


        const response = await request(app).delete('/testing/all-data');
        const blogs = await request(app).get('/blogs');
        const posts = await request(app).get('/posts');
        expect(response.status).toBe(204);
        expect(blogs.status).toBe(200);
        expect(blogs.body).toHaveLength(0);
        expect(posts.status).toBe(200);
        expect(posts.body).toHaveLength(0);

    })

})
