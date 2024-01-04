"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EAvailableResolutions = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../dist/utils");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
var EAvailableResolutions;
(function (EAvailableResolutions) {
    EAvailableResolutions["P144"] = "P144";
    EAvailableResolutions["P240"] = "P240";
    EAvailableResolutions["P360"] = "P360";
    EAvailableResolutions["P480"] = "P480";
    EAvailableResolutions["P720"] = "P720";
    EAvailableResolutions["P1080"] = "P1080";
    EAvailableResolutions["P1440"] = "P1440";
    EAvailableResolutions["P2160"] = "P2160";
})(EAvailableResolutions || (exports.EAvailableResolutions = EAvailableResolutions = {}));
let videos = [
// {
//     "id": 0,
//     "title": "string",
//     "author": "string",
//     "canBeDownloaded": true,
//     "minAgeRestriction": null,
//     "createdAt": "2024-01-03T20:07:39.656Z",
//     "publicationDate": "2024-01-03T20:07:39.656Z",
//     "availableResolutions": [
//         EAvailableResolutions.P144,
//     ]
// },
// {
//     "id": 1,
//     "title": "Sample Title 2",
//     "author": "Author 2",
//     "canBeDownloaded": false,
//     "minAgeRestriction": null,
//     "createdAt": "2024-01-03T21:15:00.000Z",
//     "publicationDate": "2024-01-03T21:15:00.000Z",
//     "availableResolutions": [
//         EAvailableResolutions.P144,
//         EAvailableResolutions.P360
//     ]
// }
];
exports.app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(video);
    }
});
exports.app.post('/videos', (req, res) => {
    let { title, author, availableResolutions } = req.body;
    let { errors, tempVideo } = (0, utils_1.validation)({ body: req.body });
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: availableResolutions ? availableResolutions : tempVideo.availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        let { title, author, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate } = req.body;
        let { errors } = (0, utils_1.validation)({ body: req.body });
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        video.title = title ? title : video.title;
        video.author = author ? author : video.author;
        video.availableResolutions = availableResolutions ? availableResolutions : video.availableResolutions;
        video.minAgeRestriction = minAgeRestriction ? minAgeRestriction : video.minAgeRestriction;
        video.canBeDownloaded = canBeDownloaded ? canBeDownloaded : video.canBeDownloaded;
        video.publicationDate = publicationDate ? publicationDate : video.publicationDate;
        res.sendStatus(204);
    }
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        videos = videos.filter(video => video.id !== id);
        res.sendStatus(204);
    }
});
exports.app.delete('/testing/all-data', (req, res) => {
    debugger;
    videos.length = 0;
    res.sendStatus(204);
});
