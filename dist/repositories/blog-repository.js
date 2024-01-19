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
const db_1 = require("../db/db");
const mapper_1 = require("../models/blogs/mappers/mapper");
const mongodb_1 = require("mongodb");
class BlogRepository {
    static getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.blogCollection.find({}).toArray()
                    .then(res => res.map(mapper_1.blogMapper));
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield db_1.blogCollection
                    .findOne({ _id: mongodb_1.ObjectId.createFromHexString(id) });
                if (blog) {
                    return (0, mapper_1.blogMapper)(blog);
                }
                return false;
            }
            catch (error) {
                console.error('Error in getBlogById:', error);
                return false;
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
                const blogId = yield db_1.blogCollection.insertOne(newBlog);
                return yield this.getBlogById(blogId.insertedId.toString());
            }
            catch (e) {
                console.log('Error in addBlog:', e);
                return false;
            }
        });
    }
    static updateBlog(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = mongodb_1.ObjectId.createFromHexString(id);
                const result = yield db_1.blogCollection.updateOne({ _id: blogId }, {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
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
                console.error('Error updating blog:', error);
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
                console.error('Error in deleteBlogById:', error);
                return false;
            }
        });
    }
}
exports.BlogRepository = BlogRepository;
