import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";
import {HTTP_STATUSES, RequestBodyWithParamsType, RequestParamType} from "../models/common";
import {blogsValidation} from "../validators/blog-validators";
import {BlogInputModel} from "../models/blogs/input";
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";
import {BlogServices} from "../domain/blog-services";


export const blogRoute = Router();

const {OK, CREATED, NO_CONTENT,  NOT_FOUND} = HTTP_STATUSES;

blogRoute.get("/", async (req: Request, res: Response) => {
    const allBlogs = await BlogServices.getAllBlogs();
    res.status(OK).send(allBlogs);
});

blogRoute.get("/:id", inputValidationMiddleware, async (req: RequestParamType<{ id: string }>, res: Response) => {
    const blog = await BlogServices.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
});

blogRoute.post("/", authMiddleware, blogsValidation(), async (req: Request, res: Response) => {
    let newBlog = await BlogServices.addBlog(req.body);
    res.status(CREATED).send(newBlog);
});

blogRoute.put("/:id", authMiddleware, blogsValidation(), async (req: RequestBodyWithParamsType<{
    id: string
}, BlogInputModel>, res: Response) => {
    const blogIsUpdate = await BlogServices.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
});

blogRoute.delete("/:id", authMiddleware, inputValidationMiddleware, async (req: RequestParamType<{
    id: string
}>, res: Response) => {
    const blogIsDelete = await BlogServices.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
