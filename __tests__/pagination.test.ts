import request from "supertest";
import {app} from "../src/settings";
import {HTTP_STATUSES} from "../src/models/common";
import {BlogViewModel} from "../src/models/blogs/output";

const {OK} = HTTP_STATUSES;
describe('Testing structure of pagination output', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })
    it('+ GET with params', async () => {
        let params = '';
        const blogs = await request(app)
            .get('/blogs')
            .query({
                searchNameTerm: null,
                sortBy: 'createdAt',
                sortDirection: 'asc',
                pageNumber: 1,
                pageSize: 7
            })
            .expect(OK)
            .expect((response) => {
                params = response.request.url.split('?')[1]
            })
        let paramsArr = params.split('&');
        expect(paramsArr).toHaveLength(5);

        expect(blogs.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 7,
            totalCount: 0,
            items: expect.any(Array<BlogViewModel>),
        })
    })
})
