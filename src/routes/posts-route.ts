import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../models/common";
import {postInputValidation} from "../validators/post-validators";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {PostServices} from "../domain/post-services";

export const postRoute = Router({});

const {OK, CREATED, NO_CONTENT,  NOT_FOUND} = HTTP_STATUSES
postRoute.get("/", async (req: Request, res: Response) => {
    const posts = await PostServices.getAllPosts();
    res.status(OK).send(posts);
});

postRoute.get("/:id", inputValidationMiddleware, async (req: Request, res: Response) => {
    const post = await PostServices.getPostById(req.params.id);
    return post ? res.status(200).send(post) : res.sendStatus(NOT_FOUND);
});

postRoute.post("/", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const newPost = await PostServices.addPost(req.body);
    res.status(CREATED).send(newPost);
});

postRoute.put("/:id", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const postIsUpdate = await PostServices.updatePost(req.params.id, req.body);
    return postIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

postRoute.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const postIsDelete = await PostServices.deletePost(req.params.id);
    return postIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})

