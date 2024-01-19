import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../models/common";
import {PostRepository} from "../repositories/post-repository";
import {postInputValidation} from "../validators/post-validators";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";

export const postRoute = Router({});

const {OK, CREATED, NO_CONTENT,  NOT_FOUND} = HTTP_STATUSES
postRoute.get("/", async (req: Request, res: Response) => {
    const posts = await PostRepository.getAllPosts();
    res.status(OK).send(posts);
});

postRoute.get("/:id", inputValidationMiddleware, async (req: Request, res: Response) => {
    const post = await PostRepository.getPostById(req.params.id);
    return post ? res.status(200).send(post) : res.sendStatus(NOT_FOUND);
});

postRoute.post("/", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const newPost = await PostRepository.addPost(req.body);
    res.status(CREATED).send(newPost);
});

postRoute.put("/:id", authMiddleware, postInputValidation(), async (req: Request, res: Response) => {
    const postIsUpdate = await PostRepository.updatePost(req.params.id, req.body);
    return postIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

postRoute.delete("/:id", authMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
    const postIsDelete = await PostRepository.deletePost(req.params.id);
    return postIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})

