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
exports.PostServices = void 0;
const post_repository_1 = require("../repositories/post-repository");
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const post_query_repository_1 = require("../repositories/post-query-repository");
class PostServices {
    static getAllPosts(sortData) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                sortBy: (_a = sortData.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
                sortDirection: (_b = sortData.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
                pageNumber: sortData.pageNumber ? +sortData.pageNumber : 1,
                pageSize: sortData.pageSize ? +sortData.pageSize : 10,
                blogId: sortData.blogId
            };
            try {
                return yield post_query_repository_1.PostQueryRepository.getAllPosts(payload);
            }
            catch (error) {
                console.error('Error in getAllPosts:', error);
                return null;
            }
        });
    }
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_query_repository_1.PostQueryRepository.getPostById(id);
            }
            catch (error) {
                console.error('Error in getPostById:', error);
                return null;
            }
        });
    }
    static addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blog_query_repository_1.BlogQueryRepository.getBlogById(post.blogId);
                if (blog) {
                    const newPost = {
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                        blogName: blog.name,
                        createdAt: new Date().toISOString(),
                    };
                    const postId = yield post_repository_1.PostRepository.addPost(newPost);
                    if (postId) {
                        return this.getPostById(postId.insertedId.toString());
                    }
                    else {
                        console.log('can not get recently added post with id: ', postId);
                        return null;
                    }
                }
                else {
                    console.log('No blog found for the provided id.');
                    return null;
                }
            }
            catch (e) {
                console.log('Error in Service addPost:', e);
                return null;
            }
        });
    }
    static updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_repository_1.PostRepository.updatePost(id, post);
            }
            catch (e) {
                console.log('Error in updatePost:', e);
                return false;
            }
        });
    }
    static deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post_repository_1.PostRepository.deletePost(id);
            }
            catch (e) {
                console.log('Error in deletePost:', e);
                return false;
            }
        });
    }
}
exports.PostServices = PostServices;
