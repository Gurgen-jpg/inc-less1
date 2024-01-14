"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/authValidation/auth-middleware");
const common_1 = require("../models/common");
const blog_repository_1 = require("../repositories/blog-repository");
const blog_validators_1 = require("../validators/blog-validators");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
exports.blogRoute = (0, express_1.Router)({});
const { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND } = common_1.HTTP_STATUSES;
exports.blogRoute.get("/", (req, res) => {
    const allBlogs = blog_repository_1.BlogRepository.getAllBlogs();
    res.status(OK).send(allBlogs);
});
exports.blogRoute.get("/:id", blog_validators_1.checkId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const blog = blog_repository_1.BlogRepository.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(NOT_FOUND);
        return;
    }
    else {
        res.status(OK).send(blog);
    }
});
exports.blogRoute.post("/", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogsValidation)(), (req, res) => {
    let newBlog = blog_repository_1.BlogRepository.addBlog(req.body);
    res.status(CREATED).send(newBlog);
});
exports.blogRoute.put("/:id", auth_middleware_1.authMiddleware, blog_validators_1.checkId, (0, blog_validators_1.blogsValidation)(), (req, res) => {
    blog_repository_1.BlogRepository.updateBlog(req.params.id, req.body);
    res.sendStatus(NO_CONTENT);
});
exports.blogRoute.delete("/:id", auth_middleware_1.authMiddleware, blog_validators_1.checkId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    blog_repository_1.BlogRepository.deleteBlog(req.params.id);
    res.sendStatus(NO_CONTENT);
});
