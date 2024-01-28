import {app} from "../src/settings";
import request from "supertest";
import {ErrorType, HTTP_STATUSES} from "../src/models/common";
import {BlogsOutputModel, BlogViewModel} from "../src/models/blogs/output";

const {OK, NOT_FOUND, CREATED, NO_CONTENT, BAD_REQUEST, UNAUTHORIZED} = HTTP_STATUSES;

export const testExpectedBlog: BlogViewModel = {
    id: expect.any(String),
    name: 'name1',
    description: 'description1',
    websiteUrl: 'https://ZCFGdNtICqwgT3n15IuD8U98pGolJl2GZCy.Y38aOX9Fthor',
    createdAt: expect.any(String),
    isMembership: false
}
describe('Testing blogs', () => {
    const auth = 'YWRtaW46cXdlcnR5';
    let blogId: string = '';
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });
    it('+create blog && get all', async () => {
        const response = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'name1',
                description: 'description1',
                websiteUrl: 'https://ZCFGdNtICqwgT3n15IuD8U98pGolJl2GZCy.Y38aOX9Fthor'
            })
        blogId = response.body.id;
        expect(response.status).toBe(CREATED);
        expect(response.body).toEqual(testExpectedBlog)
        const blogs = await request(app).get('/blogs');

        expect(blogs.status).toBe(OK);
        expect(blogs.body.items).toBeInstanceOf(Array<BlogViewModel>);
        expect(blogs.body.items).toHaveLength(1);
    })

    it('-all post validation errors', async () => {
        const blog = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: '',
                description: '',
                websiteUrl: '////////',
            })
        expect(blog.status).toBe(BAD_REQUEST);
        expect(blog.body.errorsMessages.length).toBe(3);
        const errors = blog.body.errorsMessages;
        expect(errors).toBeInstanceOf(Array<ErrorType>);
        expect(errors).toEqual([
            {
                "message": "title is required",
                "field": "name"
            },
            {
                "message": "description is required",
                "field": "description"
            },
            {
                "message": "websiteUrl must be a valid url",
                "field": "websiteUrl"
            }
        ])
    })
    //
    it('+get blog by id', async () => {
        const blog = await request(app).get(`/blogs/${blogId}`);
        expect(blog.status).toBe(OK);
        expect(blog.body).toEqual(testExpectedBlog);
    })

    it('--not found blog by id', async () => {
        const blog = await request(app).get(`/blogs/123`);
        expect(blog.status).toBe(NOT_FOUND);
    })

    it('+ update blog by id', async () => {
        const newBlog = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://UPDATED-URL.Y38aOX9Fthor'
        }
        const response = await request(app).put(`/blogs/${blogId}`)
            .set('Authorization', `Basic ${auth}`)
            .send(newBlog)
        expect(response.status).toBe(NO_CONTENT);
        const blog = await request(app).get(`/blogs/${blogId}`);
        expect(blog.body).toEqual(Object.assign(testExpectedBlog, newBlog));
    })

    it('- update blog validation errors', async () => {
        const response = await request(app).put(`/blogs/${blogId}`)
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: '',
                description: '',
                websiteUrl: '////////',
            })
        expect(response.status).toBe(BAD_REQUEST);
        expect(response.body.errorsMessages.length).toBe(3);
        const errors = response.body.errorsMessages;
        expect(errors).toBeInstanceOf(Array<ErrorType>);
        expect(errors).toEqual([
            {
                "message": "title is required",
                "field": "name"
            },
            {
                "message": "description is required",
                "field": "description"
            },
            {
                "message": "websiteUrl must be a valid url",
                "field": "websiteUrl"
            }
        ])
    })

    it('- update with bad id and bad BODY need to return 400', async () => {
        const response = await request(app).put(`/blogs/BAD-ID`)
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: '',
                description: '',
                websiteUrl: '////////',
            })
        const errors = response.body.errorsMessages;
        expect(errors).toBeInstanceOf(Array<ErrorType>);
        expect(errors).toHaveLength(3);
        expect(response.status).toBe(BAD_REQUEST);
    })

    it('- Auth error', async () => {
        const response = await request(app).put(`/blogs/${blogId}`)
            .set('Authorization', `Basic ${auth}BAD-AUTH`)
            .send({
                name: 'jkj',
                description: 'jkjkj',
                websiteUrl: 'https://ZCFGdNtICqwgT3n15IuD8U98pGolJl2GZCy.Y38aOX9Fthor',
            })
        expect(response.status).toBe(UNAUTHORIZED);
    })

    it('+ delete blog by id', async () => {
        const addNewBlog = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'name3',
                description: 'description3',
                websiteUrl: 'https://ZCFGd.Y38aOX9Fthor'
            })
        let newID = addNewBlog.body.id;
        // удалить первый элемент
        const response = await request(app).delete(`/blogs/${blogId}`).set('Authorization', `Basic ${auth}`);
        expect(response.status).toBe(NO_CONTENT);
        // проверка наличие последненего элемента
        const blog = await request(app).get(`/blogs/${newID}`);
        expect(blog.status).toBe(OK);
        // проверить актуальность элемента из базы
        const blog2 = await request(app).get(`/blogs/${newID}`);
        expect(blog2.status).toBe(OK);
        // expect(blog2.body).toEqual(state.getState()[0]);
    })

    it('+ add post to blog using POST, GET -> /blogs/:id/posts', async () => {

        const newBlogID = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'testBlog',
                description: 'description3',
                websiteUrl: 'https://ZCFGd.Y38aOX9Fthor'
            });
        expect(newBlogID.status).toBe(CREATED);

        const newPostID = await request(app).post(`/blogs/${newBlogID.body.id}/posts`)
            .set('Authorization', `Basic ${auth}`)
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1',
            });
        expect(newPostID.status).toBe(CREATED);

        const posts = await request(app).get(`/blogs/${newBlogID.body.id}/posts`)
            .set('Authorization', `Basic ${auth}`);
        expect(posts.status).toBe(OK);
        expect(posts.body.items).toHaveLength(1);
        expect(posts.body.items[0].id).toBe(newPostID.body.id);
    })

    it('- add post to blog using wrong id', async () => {
        const newBlogID = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'testWrongCase',
                description: 'description3',
                websiteUrl: 'https://ZCFGd.Y38aOX9Fthor'
            });
        expect(newBlogID.status).toBe(CREATED);

        const newPostID = await request(app).post(`/blogs/${newBlogID.body.id}'somewrongid'/posts`)
            .set('Authorization', `Basic ${auth}`)
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1',
            });
        expect(newPostID.status).toBe(BAD_REQUEST);
    })

});

