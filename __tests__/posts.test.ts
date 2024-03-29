import request from "supertest";
import {app} from "../src/settings";
import {ErrorType, HTTP_STATUSES} from "../src/models/common";
import {PostViewModel} from "../src/models/posts/output";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES;
const auth = 'YWRtaW46cXdlcnR5';

describe('Post api', () => {
    let blogID: string;
    let postID: string;

    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })

    it('create blog', async () => {
        const response = await request(app).post('/blogs')
            .set('authorization', `Basic ${auth}`)
            .send({
                name: 'name1',
                description: 'description1',
                websiteUrl: 'https://ZCFGdNtICqwgT3n15IuD8U98pGolJl2GZCy.Y38aOX9Fthor'
            })
        blogID = response.body.id;
    })

    it('get all posts', async () => {
        const response = await request(app).get('/posts');
        expect(response.status).toBe(OK);
        expect(response.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: expect.any(Array),
        });
        expect(response.body.items).toBeInstanceOf(Array<PostViewModel>);
    });

    it('create post', async () => {
        const response = await request(app).post('/posts')
            .set('authorization', `Basic ${auth}`)
            .send({
                title: 'title1',
                shortDescription: 'shortDescription1',
                content: 'content1',
                blogId: blogID,
            })
        expect(response.status).toBe(CREATED);
        postID = response.body.id;
    });

    it('-all post validation errors', async () => {
        const response = await request(app).post('/posts')
            .set('authorization', `Basic ${auth}`)
            .send({
                title: '',
                shortDescription: '',
                content: '',
                blogId: '123df',
            })
        expect(response.status).toBe(BAD_REQUEST);
        const errors = response.body.errorsMessages;
        expect(errors).toBeInstanceOf(Array<ErrorType>);
        expect(errors).toHaveLength(4);
        expect(errors).toEqual([
            {
                "message": "title must be between 1 and 30 characters",
                "field": "title"
            },
            {
                "message": "shortDescription must be between 1 and 100 characters",
                "field": "shortDescription"
            },
            {
                "message": "content must be between 1 and 1000 characters",
                "field": "content"
            },
            {
                "message": expect.any(String),
                field: "blogId"
            }
        ])
    });

    it('+get post by id', async () => {
        const response = await request(app).get(`/posts/${postID}`);
        expect(response.status).toBe(OK);
    });

    it('-get post by id', async () => {
        const response = await request(app).get('/posts/1');
        expect(response.status).toBe(BAD_REQUEST);
    });

    it('+update post', async () => {
        const response = await request(app).put(`/posts/${postID}`)
            .set('authorization', `Basic ${auth}`)
            .send({
                title: 'title2',
                shortDescription: 'shortDescription2',
                content: 'content2',
                blogId: blogID,
            })
        expect(response.status).toBe(NO_CONTENT);

        const post = await request(app).get(`/posts/${postID}`);
        expect(post.status).toBe(OK);
        expect(post.body).toEqual({
            id: postID,
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            createdAt: expect.any(String),
            blogId: blogID,
            blogName: 'name1'
        })
    });

    it('-update post', async () => {
        const response = await request(app).put(`/posts/1`)
            .set('authorization', `Basic ${auth}`)
            .send({
                title: 'title2',
                shortDescription: 'shortDescription2',
                content: 'content2',
                blogId: '12',
            })
        expect(response.status).toBe(BAD_REQUEST);
    });
    it('update post validation errors', async () => {
        const response = await request(app)
            .put(`/posts/${postID}`)
            .set('authorization', `Basic ${auth}`)
            .send({
                title: 'title2n',
                shortDescription: '',
                content: 'content2n',
                blogId: '123df',
            })

        expect(response.status).toBe(BAD_REQUEST);
        const errors = response.body.errorsMessages;
        expect(errors).toBeInstanceOf(Array<ErrorType>);
        expect(errors).toHaveLength(2);
        expect(errors).toEqual([
            {
                message: expect.any(String),
                field: "shortDescription"
            },
            {
                message: expect.any(String),
                field: "blogId"
            }
        ])
    })

    it('+delete post', async () => {
        const response = await request(app).delete(`/posts/${postID}`)
            .set('authorization', `Basic ${auth}`)
        expect(response.status).toBe(NO_CONTENT);
        const posts = await request(app).get('/posts');
        expect(posts.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: expect.any(Array),
        });
        expect(posts.body.items).toBeInstanceOf(Array<PostViewModel>);
    });

    it('-delete post', async () => {
        const response = await request(app).delete(`/posts/1`)
            .set('authorization', `Basic ${auth}`)
        expect(response.status).toBe(BAD_REQUEST);
    })

})
