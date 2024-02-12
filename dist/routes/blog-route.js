"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common");
const blog_validators_1 = require("../validators/blog-validators");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const blog_services_1 = require("../domain/blog-services");
const post_validators_1 = require("../validators/post-validators");
const basic_authorization_1 = require("../middlewares/authValidation/basic-authorization");
exports.blogRoute = (0, express_1.Router)();
const { OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST } = common_1.HTTP_STATUSES;
exports.blogRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blog_services_1.BlogServices.getAllBlogs(req.query);
    return allBlogs ? res.status(OK).send(allBlogs) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.get("/:id", input_validation_middleware_1.mongoIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_services_1.BlogServices.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.get("/:blogId/posts", input_validation_middleware_1.mongoIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield blog_services_1.BlogServices.getPostsByBlogId(Object.assign(Object.assign({}, req.query), { blogId: req.params.blogId }));
    return posts ? res.status(OK).send(posts) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.post("/", basic_authorization_1.basicAuthorizationMiddleware, (0, blog_validators_1.blogsValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newBlog = yield blog_services_1.BlogServices.addBlog(req.body);
    return newBlog ? res.status(CREATED).send(newBlog) : res.sendStatus(BAD_REQUEST);
}));
exports.blogRoute.post("/:blogId/posts", input_validation_middleware_1.mongoIdValidation, basic_authorization_1.basicAuthorizationMiddleware, (0, post_validators_1.createPostFromBlogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newPost = yield blog_services_1.BlogServices.addPostByBlogId(Object.assign(Object.assign({}, req.body), { blogId: req.params.blogId }));
    newPost ? res.status(CREATED).send(newPost) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.put("/:id", input_validation_middleware_1.mongoIdValidation, basic_authorization_1.basicAuthorizationMiddleware, (0, blog_validators_1.blogsValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsUpdate = yield blog_services_1.BlogServices.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.delete("/:id", input_validation_middleware_1.mongoIdValidation, basic_authorization_1.basicAuthorizationMiddleware, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsDelete = yield blog_services_1.BlogServices.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
