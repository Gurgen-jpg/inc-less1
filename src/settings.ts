import express, {Request, Response} from "express";
import {validation} from "./utils";

export const app = express();
app.use(express.json());


export enum EAvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160",
}

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null
    createdAt: string
    publicationDate: string
    availableResolutions: EAvailableResolutions[]
}


let videos: VideoType[] = [
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

]


type Param = {
    id: number
}

type BodyType = {
    title: string
    author: string
    availableResolutions?: EAvailableResolutions[]
    createdAt?: string;
}

type RequestParamType<P> = Request<P, unknown, unknown, unknown>;

type RequestBodyType<B> = Request<unknown, unknown, B, unknown>;

type RequestBodyWithParamsType<P, B> = Request<P, unknown, B, unknown>;

export type ErrorType = {
    message: string
    field: string
}

export type ErrorsMessageType = ErrorType[];

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos);
});

app.get('/videos/:id', (req: RequestParamType<Param>, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    } else {
        res.status(200).send(video);
    }
});

app.post('/videos', (req: RequestBodyType<BodyType>, res: Response) => {
    let {title, author, availableResolutions} = req.body;
    let {errors, tempVideo} = validation({body: req.body});
    if (errors.length > 0) {
        res.status(400).send({errorsMessages: errors});
        return;
    }

    const publicationDate = new Date();
    const createdAt = new Date(publicationDate);

    createdAt.setHours(createdAt.getHours() - 1);

    const newVideo: VideoType = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: availableResolutions ? availableResolutions : tempVideo.availableResolutions!
    }

    videos.push(newVideo);
    res.status(201);
    res.send(newVideo);
})

app.put('/videos/:id', (req: RequestBodyWithParamsType<Param, Partial<VideoType>>, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    } else {
        let {
            title,
            author,
            availableResolutions,
            minAgeRestriction,
            canBeDownloaded,
            publicationDate
        } = req.body;

        let {errors} = validation({body: req.body});

        if (errors.length > 0) {
            res.status(400).send({errorsMessages: errors});
            return;
        }

        video.title = title!;
        video.author = author!;
        video.availableResolutions = availableResolutions ? availableResolutions : video.availableResolutions;
        video.minAgeRestriction = minAgeRestriction ? minAgeRestriction : video.minAgeRestriction;
        video.canBeDownloaded = canBeDownloaded ? canBeDownloaded : video.canBeDownloaded;
        video.publicationDate = publicationDate ? publicationDate : video.publicationDate;

        res.sendStatus(204);
    }
})

app.delete('/videos/:id', (req: RequestParamType<Param>, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    } else {
        videos = videos.filter(video => video.id !== id);
        res.sendStatus(204);
    }
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0;
    res.sendStatus(204);
})



