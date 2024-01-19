import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {HTTP_STATUSES, RequestBodyWithParamsType, RequestParamType} from "../models/common";
import {BlogRepository} from "../repositories/blog-repository";
import {blogsValidation} from "../validators/blog-validators";
import {BlogInputModel} from "../models/blogs/input";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";


export const blogRoute = Router();

const {OK, CREATED, NO_CONTENT,  NOT_FOUND} = HTTP_STATUSES;

blogRoute.get("/", async (req: Request, res: Response) => {
    const allBlogs = await BlogRepository.getAllBlogs();
    res.status(OK).send(allBlogs);
});

blogRoute.get("/:id", inputValidationMiddleware, async (req: RequestParamType<{ id: string }>, res: Response) => {
    const blog = await BlogRepository.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
});

blogRoute.post("/", authMiddleware, blogsValidation(), async (req: Request, res: Response) => {
    let newBlog = await BlogRepository.addBlog(req.body);
    res.status(CREATED).send(newBlog);
});

blogRoute.put("/:id", authMiddleware, blogsValidation(), async (req: RequestBodyWithParamsType<{
    id: string
}, BlogInputModel>, res: Response) => {
    const blogIsUpdate = await BlogRepository.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

blogRoute.delete("/:id", authMiddleware, inputValidationMiddleware, async (req: RequestParamType<{
    id: string
}>, res: Response) => {
    const blogIsDelete = await BlogRepository.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
