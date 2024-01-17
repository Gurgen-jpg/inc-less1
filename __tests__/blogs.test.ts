import {app} from "../src/settings";
import request from "supertest";
import {BlogModel, Blogs} from "../src/models/blogs/output";
import {ErrorType, HTTP_STATUSES} from "../src/models/common";
import {BlogUpdateModel} from "../src/models/blogs/input";

const {OK, NOT_FOUND, CREATED, NO_CONTENT, BAD_REQUEST, UNAUTHORIZED} = HTTP_STATUSES;

const state = {
    state: [] as BlogModel[],
    getState() {
        return this.state;
    },
    setState(blog: BlogModel) {
        this.state.push(blog);
    },
    find(id: string) {
        return this.state.find(blog => blog.id === id);
    },
    update(id: string, blog: BlogUpdateModel) {
        const blogToUpdate = this.state.find(blog => blog.id === id);
        if (blogToUpdate) {
            blogToUpdate.name = blog.name;
            blogToUpdate.description = blog.description;
            blogToUpdate.websiteUrl = blog.websiteUrl;
        }
    },
    delete(id: string) {
        this.state = this.state.filter(blog => blog.id !== id);
    }

}

describe('Testing blogs', () => {
    const auth = 'YWRtaW46cXdlcnR5';

    it('+create blog && get all', async () => {
        const response = await request(app).post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'name1',
                description: 'description1',
                websiteUrl: 'https://ZCFGdNtICqwgT3n15IuD8U98pGolJl2GZCy.Y38aOX9Fthor'
            })

        state.setState(response.body);
//todo !!!! переписать по новому

        expect.setState({body: response.body})
        expect(response.status).toBe(CREATED);

        const blogs = await request(app).get('/blogs');

        expect(blogs.status).toBe(OK);
        expect(blogs.body).toHaveLength(1);

        // сравнить то что в базе и локальный стейт
        let blog = blogs.body[0];
        expect(blog).toEqual(state.find(blog.id));
    })

    it('-all post validation errors', async () => {
//todo !!!! переписать по новому
        const {body} = expect.getState()
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

    it('+get blog by id', async () => {
        const blog = await request(app).get(`/blogs/${state.getState()[0].id}`);
        expect(blog.status).toBe(OK);
        expect(blog.body).toEqual(state.getState()[0]);
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
        const response = await request(app).put(`/blogs/${state.getState()[0].id}`)
            .set('Authorization', `Basic ${auth}`)
            .send(newBlog)
        expect(response.status).toBe(NO_CONTENT);
        state.update(state.getState()[0].id, newBlog);
        const blog = await request(app).get(`/blogs/${state.getState()[0].id}`);
        expect(blog.body).toEqual(state.getState()[0]);
    })

    it('- update blog validation errors', async () => {
        const response = await request(app).put(`/blogs/${state.getState()[0].id}`)
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

    it('- update with bad id', async () => {
        const response = await request(app).put(`/blogs/BAD-ID`)
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: '',
                description: '',
                websiteUrl: '////////',
            })
        expect(response.status).toBe(NOT_FOUND);
    })

    it('- Auth error', async () => {
        const response = await request(app).put(`/blogs/${state.getState()[0].id}`)
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
        state.setState(addNewBlog.body);
        // удалить первый элемент
        const response = await request(app).delete(`/blogs/${state.getState()[0].id}`).set('Authorization', `Basic ${auth}`);
        state.delete(state.getState()[0].id);
        expect(response.status).toBe(NO_CONTENT);
        // проверка наличие последненего элемента
        const blog = await request(app).get(`/blogs/${state.getState()[0].id}`);
        expect(blog.status).toBe(OK);
        // проверить актуальность элемента из базы
        const blog2 = await request(app).get(`/blogs/${newID}`);
        expect(blog2.status).toBe(OK);
        expect(blog2.body).toEqual(state.getState()[0]);
    })

});

