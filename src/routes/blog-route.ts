import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";

import {HTTP_STATUSES, RequestBodyWithParamsType, RequestParamType} from "../models/common";
import {BlogRepository} from "../repositories/blog-repository";
import {blogsValidation, checkId} from "../validators/blog-validators";
import {BlogInputModel} from "../models/blogs/input";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";


export const blogRoute = Router({});

const {OK   , CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = HTTP_STATUSES;

blogRoute.get("/", (req: Request, res: Response) => {
    const allBlogs = BlogRepository.getAllBlogs();
    res.status(OK).send(allBlogs);
});

blogRoute.get("/:id", checkId, inputValidationMiddleware, (req: RequestParamType<{ id: string }>, res: Response) => {
    const blog = BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(NOT_FOUND);
        return;
    } else {
        res.status(OK).send(blog);
    }
});

blogRoute.post("/", authMiddleware, blogsValidation(), (req: Request, res: Response) => {
    let newBlog = BlogRepository.addBlog(req.body);
    res.status(CREATED).send(newBlog);
});

blogRoute.put("/:id", authMiddleware, checkId, blogsValidation(), (req: RequestBodyWithParamsType<{ id: string }, BlogInputModel>, res: Response) => {
    BlogRepository.updateBlog(req.params.id, req.body);
    res.sendStatus(NO_CONTENT);
});

blogRoute.delete("/:id", authMiddleware, checkId, inputValidationMiddleware, (req: RequestParamType<{ id: string }>, res: Response) => {
    BlogRepository.deleteBlog(req.params.id);
    res.sendStatus(NO_CONTENT);
})
