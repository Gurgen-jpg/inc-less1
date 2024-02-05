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
exports.postRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common");
const post_validators_1 = require("../validators/post-validators");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const post_services_1 = require("../domain/post-services");
const mongodb_1 = require("mongodb");
const basic_authorization_1 = require("../middlewares/authValidation/basic-authorization");
exports.postRoute = (0, express_1.Router)({});
const { OK, CREATED, NO_CONTENT, NOT_FOUND } = common_1.HTTP_STATUSES;
exports.postRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_services_1.PostServices.getAllPosts(req.query);
    res.status(OK).send(posts);
}));
exports.postRoute.get("/:id", input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const post = yield post_services_1.PostServices.getPostById(req.params.id);
    return post ? res.status(200).send(post) : res.sendStatus(NOT_FOUND);
}));
exports.postRoute.post("/", basic_authorization_1.basicAuthorizationMiddleware, (0, post_validators_1.postInputValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield post_services_1.PostServices.addPost(req.body);
    res.status(CREATED).send(newPost);
}));
exports.postRoute.put("/:id", basic_authorization_1.basicAuthorizationMiddleware, (0, post_validators_1.postInputValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsUpdate = yield post_services_1.PostServices.updatePost(req.params.id, req.body);
    return postIsUpdate ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
exports.postRoute.delete("/:id", basic_authorization_1.basicAuthorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        return res.sendStatus(NOT_FOUND);
    }
    const postIsDelete = yield post_services_1.PostServices.deletePost(req.params.id);
    return postIsDelete ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
