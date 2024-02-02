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
exports.BlogServices = void 0;
const blog_repository_1 = require("../repositories/blog-repository");
const blog_query_repository_1 = require("../repositories/blog-query-repository");
const post_repository_1 = require("../repositories/post-repository");
const post_query_repository_1 = require("../repositories/post-query-repository");
class BlogServices {
    static getAllBlogs(sortData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                sortBy: (_a = sortData.sortBy) !== null && _a !== void 0 ? _a : 'createdAt',
                sortDirection: (_b = sortData.sortDirection) !== null && _b !== void 0 ? _b : 'desc',
                pageNumber: sortData.pageNumber ? +sortData.pageNumber : 1,
                pageSize: sortData.pageSize ? +sortData.pageSize : 10,
                searchNameTerm: (_c = sortData.searchNameTerm) !== null && _c !== void 0 ? _c : null
            };
            try {
                return yield blog_query_repository_1.BlogQueryRepository.getAllBlogs(payload);
            }
            catch (error) {
                console.log('Error in Service getAllBlogs: ', error);
                return null;
            }
        });
    }
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield blog_query_repository_1.BlogQueryRepository.getBlogById(id);
            }
            catch (error) {
                console.error('Error in Service getBlogById:', error);
                return null;
            }
        });
    }
    static getPostsByBlogId(sortData) {
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
                const blog = yield blog_query_repository_1.BlogQueryRepository.getBlogById(payload.blogId);
                if (!blog) {
                    console.log('No blog found for the provided id.');
                    return null;
                }
                return yield post_query_repository_1.PostQueryRepository.getAllPosts(payload);
            }
            catch (error) {
                console.log('Error in Service getAllBlogs: ', error);
                return null;
            }
        });
    }
    static addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBlog = {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                };
                return yield blog_repository_1.BlogRepository.addBlog(newBlog);
            }
            catch (e) {
                console.log('Error in Service addBlog:', e);
                return null;
            }
        });
    }
    static addPostByBlogId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = payload;
            const blogName = yield blog_repository_1.BlogRepository.getBlogById(blogId).then(res => res === null || res === void 0 ? void 0 : res.name);
            try {
                if (!blogName) {
                    console.log('No blog found for the provided id.');
                    return null;
                }
                const newPost = {
                    title,
                    shortDescription,
                    content,
                    blogId,
                    blogName,
                    createdAt: new Date().toISOString(),
                };
                const postId = yield post_repository_1.PostRepository.addPost(newPost);
                if (postId) {
                    return yield post_query_repository_1.PostQueryRepository.getPostById(postId.insertedId.toString());
                }
                else {
                    console.log('can not get recently added post with id: ', postId);
                    return null;
                }
            }
            catch (e) {
                console.log('Error in Service addBlog:', e);
                return null;
            }
        });
    }
    static updateBlog(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield blog_repository_1.BlogRepository.updateBlog(id, blog);
            }
            catch (error) {
                console.error('Error in Service updating blog:', error);
                return false;
            }
        });
    }
    static deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield blog_repository_1.BlogRepository.deleteBlog(id);
            }
            catch (error) {
                console.error('Error in Service deleteBlogById:', error);
                return false;
            }
        });
    }
}
exports.BlogServices = BlogServices;
