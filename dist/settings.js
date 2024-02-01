"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blog_route_1 = require("./routes/blog-route");
const posts_route_1 = require("./routes/posts-route");
const testing_route_1 = require("./routes/testing-route");
const auth_route_1 = require("./routes/auth-route");
const users_route_1 = require("./routes/users-route");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/blogs', blog_route_1.blogRoute);
exports.app.use('/posts', posts_route_1.postRoute);
exports.app.use('/testing', testing_route_1.testingRoute);
exports.app.use('/auth', auth_route_1.authRoute);
exports.app.use('/users', users_route_1.usersRoute);
