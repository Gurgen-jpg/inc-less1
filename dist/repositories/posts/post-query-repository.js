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
exports.PostQueryRepository = void 0;
const db_1 = require("../../db/db");
const allPostsMapper_1 = require("../../models/posts/mappers/allPostsMapper");
const mongodb_1 = require("mongodb");
class PostQueryRepository {
    static getAllPosts(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, pageNumber, sortBy, sortDirection, blogId } = sortData;
            const filter = blogId ? { blogId } : {};
            try {
                const totalCount = yield db_1.postCollection.countDocuments(filter);
                const pagesCount = Math.ceil(totalCount / pageSize);
                const posts = yield db_1.postCollection
                    .find(filter)
                    .sort(sortBy, sortDirection)
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray();
                return {
                    pageSize,
                    page: pageNumber,
                    pagesCount,
                    totalCount,
                    items: posts.map(allPostsMapper_1.allPostsMapper)
                };
            }
            catch (error) {
                console.error('Error in getAllPosts:', error);
                return null;
            }
        });
    }
    // static async getAllPostsByBlogId(blogId: string): Promise<PaginationType<PostViewModel> | null> {
    //     try {
    //         const postId = ObjectId.createFromHexString(blogId);
    //         const posts = await postCollection
    //             .find({_id: postId})
    //             .toArray();
    //         return {
    //             pagesCount: 1,
    //             page: 1,
    //             pageSize: posts.length,
    //             totalCount: posts.length,
    //             items: posts.map(allPostsMapper)
    //         }
    //     } catch (error) {
    //         console.error('Error in getAllPostsByBlogId:', error);
    //         return null
    //     }
    // }
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = mongodb_1.ObjectId.createFromHexString(id);
                const post = yield db_1.postCollection.findOne({ _id: postId });
                if (post) {
                    return (0, allPostsMapper_1.allPostsMapper)(post);
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error in getPostById:', error);
                return null;
            }
        });
    }
}
exports.PostQueryRepository = PostQueryRepository;
