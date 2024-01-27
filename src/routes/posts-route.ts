import {Router, Request, Response} from "express";
import {HTTP_STATUSES, RequestWithQueryType} from "../models/common";
import {postInputValidation} from "../validators/post-validators";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {PostServices} from "../domain/post-services";
import {PostQueryRepoInputModel} from "../models/posts/postQueryRepoInputModel";
import {ObjectId} from "mongodb";

export const postRoute = Router({});

const {OK, CREATED, NO_CONTENT,  NOT_FOUND} = HTTP_STATUSES
postRoute.get("/", async (req: RequestWithQueryType<PostQueryRepoInputModel>, res: Response) => {
    const posts = await PostServices.getAllPosts(req.query);
    res.status(OK).send(posts);
});

postRoute.get("/:id", inputValidationMiddleware, async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const post = await PostServices.getPostById(req.params.id);
    return post ? res.status(200).send(post) : res.sendStatus(NOT_FOUND);
});

postRoute.post("/", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const newPost = await PostServices.addPost(req.body);
    res.status(CREATED).send(newPost);
});

postRoute.put("/:id", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsUpdate = await PostServices.updatePost(req.params.id, req.body);
    return postIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

postRoute.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsDelete = await PostServices.deletePost(req.params.id);
    return postIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})

