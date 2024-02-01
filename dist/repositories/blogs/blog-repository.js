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
exports.BlogRepository = void 0;
const db_1 = require("../../db/db");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("./blog-query-repository");
class BlogRepository {
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield db_1.blogCollection
                    .findOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                if (blog) {
                    return blog;
                }
                return null;
            }
            catch (error) {
                console.error('Error in Repository getBlogById:', error);
                return null;
            }
        });
    }
    static addBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = yield db_1.blogCollection.insertOne(blog);
                return yield blog_query_repository_1.BlogQueryRepository.getBlogById(blogId.insertedId.toString());
            }
            catch (e) {
                console.log('Error in Repository addBlog:', e);
                return null;
            }
        });
    }
    static updateBlog(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = blog;
            try {
                const blogId = mongodb_1.ObjectId.createFromHexString(id);
                const result = yield db_1.blogCollection.updateOne({ _id: blogId }, {
                    $set: {
                        name,
                        description,
                        websiteUrl
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
            catch (error) {
                console.error('Error in Repository  updating blog:', error);
                return false;
            }
        });
    }
    static deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogIsDeleted = yield db_1.blogCollection.deleteOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                yield db_1.postCollection.deleteMany({ blogId: id });
                return blogIsDeleted.deletedCount === 1;
            }
            catch (error) {
                console.error('Error in Repository  deleteBlogById:', error);
                return false;
            }
        });
    }
}
exports.BlogRepository = BlogRepository;
