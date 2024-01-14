import {app} from "../src/settings";
import request from "supertest";

describe('testing delete all data', () => {
    it('delete all data', async () => {
        const response = await request(app).delete('/testing/all-data');
        expect(response.status).toBe(204);
    })
})
