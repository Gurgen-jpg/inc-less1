import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {blogValidators} from "../validators/blog-validators";
import {HTTP_STATUSES, RequestParamType} from "../models/common";
import {BlogRepository} from "../repositories/blog-repository";

export const blogRoute = Router({});

const {OK   , CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES;

blogRoute.get("/", authMiddleware, blogValidators(), (req: Request, res: Response) => {
    const allBlogs = BlogRepository.getAllBlogs();
    res.send(OK).send(allBlogs);
});

blogRoute.get("/:id", authMiddleware, blogValidators(), (req: RequestParamType<{ id: string }>, res: Response) => {
    const blog = BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(NOT_FOUND);
        return;
    } else {
        res.status(OK).send(blog);
    }
});

blogRoute.post("/", authMiddleware, blogValidators(), (req: Request, res: Response) => {

})
