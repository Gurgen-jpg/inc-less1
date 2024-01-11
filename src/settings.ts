import express, {Request, Response} from "express";
import {blogRoute} from "./routes/blog-route";
import {VideoType} from "./models/common";

export const app = express();
app.use(express.json());
app.use('/blogs', blogRoute)


let videos: VideoType[] = []

//
// const {
//     OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND
// } = HTTP_STATUSES;



// app.get('/videos', (req: Request, res: Response) => {
//     res.status(OK).send(videos);
// });
//
// app.get('/videos/:id', (req: RequestParamType<Param>, res: Response) => {
//     const id = +req.params.id;
//     const video = videos.find(video => video.id === id);
//     if (!video) {
//         res.sendStatus(NOT_FOUND);
//         return;
//     } else {
//         res.status(OK).send(video);
//     }
// });
//
// app.post('/videos', (req: RequestBodyType<BodyType>, res: Response) => {
//     let {title, author, availableResolutions} = req.body;
//     let {errorsMessages, tempVideo} = validation({body: req.body});
//     if (errorsMessages.length > 0) {
//         res.status(BAD_REQUEST).send({errorsMessages});
//         return;
//     }
//
//     const publicationDate = new Date();
//     const createdAt = new Date();
//
//     publicationDate.setDate(createdAt.getDate() + 1);
//
//     const newVideo: VideoType = {
//         id: +(new Date()),
//         title,
//         author,
//         canBeDownloaded: false,
//         minAgeRestriction: null,
//         createdAt: createdAt.toISOString(),
//         publicationDate: publicationDate.toISOString(),
//         availableResolutions: availableResolutions ? availableResolutions : tempVideo.availableResolutions!
//     }
//
//     videos.push(newVideo);
//     res.status(CREATED);
//     res.send(newVideo);
// })
//
// app.put('/videos/:id', (req: RequestBodyWithParamsType<Param, Partial<VideoType>>, res: Response) => {
//     const id = +req.params.id;
//     const video = videos.find(video => video.id === id);
//     if (!video) {
//         res.sendStatus(NOT_FOUND);
//         return;
//     } else {
//         let {
//             title,
//             author,
//             availableResolutions,
//             minAgeRestriction,
//             canBeDownloaded,
//             publicationDate
//         } = req.body;
//
//         let {errorsMessages} = validation({body: req.body});
//
//         if (errorsMessages.length > 0) {
//             res.status(BAD_REQUEST).send({errorsMessages});
//             return;
//         }
//
//         video.title = title!;
//         video.author = author!;
//         video.availableResolutions = availableResolutions ? availableResolutions : video.availableResolutions;
//         video.minAgeRestriction = minAgeRestriction ? minAgeRestriction : video.minAgeRestriction;
//         video.canBeDownloaded = canBeDownloaded ? canBeDownloaded : video.canBeDownloaded;
//         video.publicationDate = publicationDate ? publicationDate : video.publicationDate;
//
//         res.sendStatus(NO_CONTENT);
//     }
// })
//
// app.delete('/videos/:id', (req: RequestParamType<Param>, res: Response) => {
//     const id = +req.params.id;
//     const video = videos.find(video => video.id === id);
//     if (!video) {
//         res.sendStatus(NOT_FOUND);
//         return;
//     } else {
//         videos = videos.filter(video => video.id !== id);
//         res.sendStatus(NO_CONTENT);
//     }
// })
//
// app.delete('/testing/all-data', (req: Request, res: Response) => {
//     videos.length = 0;
//     res.sendStatus(NO_CONTENT);
// })



