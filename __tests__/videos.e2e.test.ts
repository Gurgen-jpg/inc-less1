import {app} from "../src/settings";
import request from 'supertest';
import 'jest';
import {EAvailableResolutions, ErrorType, HTTP_STATUSES, VideoType} from "../src/models/common";

const {
     NOT_FOUND
} = HTTP_STATUSES;
describe(' test videos api', () => {

    let id: number;
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    })

    let newVideo = {
        title: 'title',
        author: 'author',
    }

    it('+ get all videos', async () => {
        await request(app).get('/videos').expect([]);
    })

    it('+ create new video, check right post logic', async () => {
        await request(app).post('/videos').send(newVideo);
        const response = await request(app).get('/videos');
        expect(response.body)
        expect(response.body.length).toBe(1);
        expect(response.body).toBeInstanceOf(Array<VideoType>);

        const firstVideo = response.body[0];

        expect(firstVideo.id).toBeGreaterThan(0);
        expect(firstVideo.title).toBe(newVideo.title);
        expect(firstVideo.author).toBe(newVideo.author);
        expect(firstVideo.availableResolutions.length).toBe(0);
        expect(firstVideo.availableResolutions).toBeInstanceOf(Array<EAvailableResolutions>);
        const videos = await request(app).get('/videos');
        expect(videos.body).toHaveLength(1);
        id = videos.body[0].id;
    })

    it('+ edit video additional resolution', async () => {
        // получить ID нового видео
        const id = await request(app).get('/videos').then(res => res.body[0].id);
        expect(id).toBeGreaterThan(0);
        await request(app).put(`/videos/${id}`).send({
            title: 'title',
            author: 'author',
            availableResolutions: [EAvailableResolutions.P144, EAvailableResolutions.P720],
        });
        const response = await request(app).get('/videos');

        expect(response.body).toBeInstanceOf(Array<VideoType>);
        expect(response.body.length).toBe(1);

        const firstVideo = response.body[0];
// проверка обновления массива разрешений
        expect(firstVideo.availableResolutions).toBeInstanceOf(Array<EAvailableResolutions>);
        expect(firstVideo.availableResolutions.length).toBe(2);
        firstVideo.availableResolutions.forEach((resolution: EAvailableResolutions) => {
            expect(Object.values(EAvailableResolutions)).toContain(resolution);
        })
    })

    // проверка иалидации данных - Param & requestBody
    it('- invalid put Param', async () => {
        await request(app).put('/videos/45').send({
            title: 'title',
            author: 'author',
            availableResolutions: ['P144', 'P720'],
        }).expect(NOT_FOUND);
    })

    it('- invalid get Param', async () => {
        await request(app).get('/videos/45').expect(NOT_FOUND);
    })

    it('- invalid delete Param', async () => {
        await request(app).delete('/videos/45').expect(NOT_FOUND);
    })

    it('- invalid post body', async () => {
        const response = await request(app).post('/videos').send({
            title: 111,
            author: '',
            availableResolutions: [900, 780],
        });
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toBeInstanceOf(Array<ErrorType>);
        expect(response.body.errorsMessages.length).toBe(4);
        expect(response.body.errorsMessages[3].field).toBe('availableResolutions');
        expect(response.body.errorsMessages[3].message).toContain('780');
    })

    it('- invalid put body', async () => {
        // const id = await request(app).get('/videos').then(res => res.body[0].id);

        const response = await request(app).put(`/videos/${id}`).send({
            title: 111,
            author: '',
            availableResolutions: [900],
            ageRestriction: 0,
            canBeDownloaded: 1,
        });
        expect(response.status).toBe(400);
        expect(response.body.errorsMessages).toBeInstanceOf(Array<ErrorType>);
        expect(response.body.errorsMessages.length).toBe(4);
        expect(response.body.errorsMessages).toEqual([
            {
                "field": "title",
                "message": "Incorrect title"
            },
            {
                "field": "author",
                "message": "Incorrect author"
            },
            {
                "field": "availableResolutions",
                "message": "Incorrect resolution: 900"
            },
            {
                "field": "canBeDownloaded",
                "message": "Incorrect can be downloaded"
            }
        ]);
    })
})

