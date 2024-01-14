"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common");
const post_repository_1 = require("../repositories/post-repository");
const post_validators_1 = require("../validators/post-validators");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const auth_middleware_1 = require("../middlewares/authValidation/auth-middleware");
exports.postRoute = (0, express_1.Router)({});
const { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND } = common_1.HTTP_STATUSES;
exports.postRoute.get("/", (req, res) => {
    const posts = post_repository_1.PostRepository.getAllPosts();
    res.status(OK).send(posts);
});
exports.postRoute.get("/:id", post_validators_1.checkId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const post = post_repository_1.PostRepository.getPostById(req.params.id);
    res.status(200).send(post);
});
exports.postRoute.post("/", auth_middleware_1.authMiddleware, (0, post_validators_1.postInputValidation)(), (req, res) => {
    const newPost = post_repository_1.PostRepository.addPost(req.body);
    res.status(CREATED).send(newPost);
});
exports.postRoute.put("/:id", auth_middleware_1.authMiddleware, post_validators_1.checkId, (0, post_validators_1.postInputValidation)(), (req, res) => {
    post_repository_1.PostRepository.updatePost(req.params.id, req.body);
    res.sendStatus(NO_CONTENT);
});
exports.postRoute.delete("/:id", auth_middleware_1.authMiddleware, post_validators_1.checkId, (0, post_validators_1.postInputValidation)(), (req, res) => {
    post_repository_1.PostRepository.deletePost(req.params.id);
    res.sendStatus(NO_CONTENT);
});
