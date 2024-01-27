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
const auth_middleware_1 = require("../middlewares/authValidation/auth-middleware");
const common_1 = require("../models/common");
const blog_validators_1 = require("../validators/blog-validators");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const blog_services_1 = require("../domain/blog-services");
const post_validators_1 = require("../validators/post-validators");
const mongodb_1 = require("mongodb");
exports.blogRoute = (0, express_1.Router)();
const { OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST } = common_1.HTTP_STATUSES;
exports.blogRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchNameTerm = null, sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10 } = req.query;
    const allBlogs = yield blog_services_1.BlogServices.getAllBlogs({ searchNameTerm, sortBy, sortDirection, pageNumber, pageSize });
    res.status(OK).send(allBlogs);
}));
exports.blogRoute.get("/:id", input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blog = yield blog_services_1.BlogServices.getBlogById(req.params.id);
    return blog ? res.status(OK).send(blog) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.get("/:blogId/posts", input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.blogId)) {
        return res.sendStatus(NOT_FOUND);
    }
    const posts = yield blog_services_1.BlogServices.getPostsByBlogId(Object.assign(Object.assign({}, req.query), { blogId: req.params.blogId }));
    return posts ? res.status(OK).send(posts) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.post("/", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogsValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newBlog = yield blog_services_1.BlogServices.addBlog(req.body);
    res.status(CREATED).send(newBlog);
}));
exports.blogRoute.post("/:blogId/posts", auth_middleware_1.authMiddleware, (0, post_validators_1.createPostFromBlogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.blogId)) {
        res.sendStatus(NOT_FOUND);
    }
    else {
        let newPost = yield blog_services_1.BlogServices.addPostByBlogId(Object.assign(Object.assign({}, req.body), { blogId: req.params.blogId }));
        res.status(CREATED).send(newPost);
    }
}));
exports.blogRoute.put("/:id", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogsValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blogIsUpdate = yield blog_services_1.BlogServices.updateBlog(req.params.id, req.body);
    return blogIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
exports.blogRoute.delete("/:id", auth_middleware_1.authMiddleware, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const blogIsDelete = yield blog_services_1.BlogServices.deleteBlog(req.params.id);
    return blogIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
