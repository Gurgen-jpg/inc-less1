import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../models/common";
import {PostRepository} from "../repositories/post-repository";
import {checkId, postInputValidation} from "../validators/post-validators";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";

export const postRoute = Router({});

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES
postRoute.get("/", (req, res) => {
    const posts = PostRepository.getAllPosts();
    res.status(OK).send(posts);
});

postRoute.get("/:id", checkId, inputValidationMiddleware, (req: Request, res: Response) => {
    const post = PostRepository.getPostById(req.params.id);
    res.status(200).send(post);
});

postRoute.post("/", authMiddleware, postInputValidation(), (req: Request, res: Response) => {
    const newPost = PostRepository.addPost(req.body);
    res.status(CREATED).send(newPost);
});

postRoute.put("/:id", authMiddleware, checkId, postInputValidation(), (req: Request, res: Response) => {
    PostRepository.updatePost(req.params.id, req.body);
    res.sendStatus(NO_CONTENT);
});

postRoute.delete("/:id", authMiddleware, checkId, postInputValidation(), (req: Request, res: Response) => {
    PostRepository.deletePost(req.params.id);
    res.sendStatus(NO_CONTENT);
})

