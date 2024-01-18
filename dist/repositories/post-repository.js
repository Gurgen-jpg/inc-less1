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
exports.PostRepository = void 0;
const db_1 = require("../db/db");
const allPostsMapper_1 = require("../models/posts/mappers/allPostsMapper");
const mongodb_1 = require("mongodb");
const blog_repository_1 = require("./blog-repository");
class PostRepository {
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield db_1.postCollection.find({}).toArray();
                return posts.map(allPostsMapper_1.allPostsMapper);
            }
            catch (error) {
                console.error('Error in getAllPosts:', error);
                return false;
            }
        });
    }
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = mongodb_1.ObjectId.createFromHexString(id);
                const post = yield db_1.postCollection.findOne({ _id: postId });
                if (post) {
                    return (0, allPostsMapper_1.allPostsMapper)(post);
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error in getPostById:', error);
                return false;
            }
        });
    }
    static addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blog_repository_1.BlogRepository.getBlogById(post.blogId);
            if (typeof blog !== "boolean") {
                const newPost = {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: blog.name,
                    createdAt: new Date().toISOString(),
                    isMembership: false
                };
                const postId = yield db_1.postCollection.insertOne(newPost);
                return yield this.getPostById(postId.insertedId.toString());
            }
            return false;
        });
    }
    static updatePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.postCollection.updateOne({ _id: mongodb_1.ObjectId.createFromHexString(id) }, {
                    $set: {
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content
                    }
                });
                if (result.modifiedCount === 1) {
                    return true;
                }
                else {
                    console.warn('No document found for the provided id.');
                    return false;
                }
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
                const result = yield db_1.postCollection.deleteOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                if (result.deletedCount === 1) {
                    return true;
                }
                else {
                    console.warn('No document found for the provided id.');
                    return false;
                }
            }
            catch (e) {
                console.log('Error in deletePost:', e);
                return false;
            }
        });
    }
}
exports.PostRepository = PostRepository;
