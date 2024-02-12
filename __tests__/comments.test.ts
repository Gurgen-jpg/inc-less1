import request from "supertest";
import {app} from "../src/settings";
import {createUsers} from "./utils/createData";
import exp = require("node:constants");

describe('comments', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('+createComment', async () => {
        const blog = await request(app).post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'test',
                description: 'test',
                websiteUrl: 'https://site.com',
                createdAt: new Date().toISOString(),
                isMembership: false
            })
        expect(blog.status).toBe(201);
        expect(blog.body.id).toBeDefined();
        expect.setState({blogId: blog.body.id});

        const post = await request(app)
            .post(`/blogs/${expect.getState().blogId}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'New post',
                shortDescription: 'Post to blog',
                content: 'some strange content ever i seen',
                blogId: expect.getState().blogId
            })
        expect.setState({postId: post.body.id});
        expect(post.status).toBe(201);
        await createUsers(1);
        const token = await request(app).post('/auth/login').send({
            loginOrEmail: 'login0',
            password: 'password0'
        });
        expect.setState({token: token.body.token});
        expect(token.status).toBe(200);
        const user = await request(app).get('/auth/me').set({
            Authorization: `Bearer ${token.body.token}`
        });
        expect(user.body).toBeDefined();

        const commentId = await request(app)
            .post(`/posts/${expect.getState().postId}/comments`)
            .send({
                content: 'content of comment ' + new Date().toISOString(),
            })
            .set({
                Authorization: `Bearer ${token.body.token}`
            })
        expect(commentId.status).toBe(201);
        expect(commentId.body.postId).toBe(expect.getState().postId);
    });
    it('+getCommentsByPostId', async () => {
        const postId = expect.getState().postId;
        const token = expect.getState().token;
        const commentsPromise = Array(15).fill(0).map(async () => {

            await request(app)
                .post(`/posts/${postId}/comments`)
                .send({
                    content: 'content of comment long ' + new Date().toISOString() + ' ' + new Date().toISOString(),
                })
                .set({
                    Authorization: `Bearer ${token}`
                })
        });
        await Promise.all(commentsPromise);
        const comments = await request(app).get(`/posts/${postId}/comments`);
        expect(comments.status).toBe(200);
        expect(comments.body.items).toHaveLength(10);
        Array(10).forEach((_, id) => {
            expect(comments.body.items[id].content).toContain('content of');
            expect(comments.body.items[id].postId).toBe(postId);
        })
        expect.setState({comment: comments.body.items[0]});
    })
    it('-Wrong postId', async () => {
        const comments = await request(app).get(`/posts/65c66e4622b8d2211b4cLec9/comments`);
        expect(comments.status).toBe(400);
    })
    it('-Wrong FORMAT - postId', async () => {
        const comments = await request(app).get(`/posts/----404--/comments`);
        expect(comments.status).toBe(400);
    })

    it('+getCommentById', async () => {
        const res = await request(app)
            .get(`/comments/${expect.getState().comment.id}`)
            // .set({
            //     Authorization: `Bearer ${expect.getState().token}`
            // })
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(expect.getState().comment.id);
        expect(res.body.content).toBe(expect.getState().comment.content);
    })

    it('+updateComment', async () => {
        const res = await request(app)
            .put(`/comments/${expect.getState().comment.id}`)
            .send({
                content: 'updated content for testing process check ID',
            })
            .set({
                Authorization: `Bearer ${expect.getState().token}`
            })
        expect(res.status).toBe(204);
        const comment = await request(app)
            .get(`/comments/${expect.getState().comment.id}`)
        expect(comment.status).toBe(200);
        expect(comment.body.content).toBe('updated content for testing process check ID');
    })

    it('+deleteComment', async () => {
        const res = await request(app)
            .delete(`/comments/${expect.getState().comment.id}`)
            .set({
                Authorization: `Bearer ${expect.getState().token}`
            })
        expect(res.status).toBe(204);
        const comment = await request(app)
            .get(`/comments/${expect.getState().comment.id}`)
        expect(comment).toHaveProperty('status', 404);
    })
})
