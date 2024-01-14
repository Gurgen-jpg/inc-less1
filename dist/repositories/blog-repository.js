"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
class BlogRepository {
    static getAllBlogs() {
        return db_1.db.blogs;
    }
    static getBlogById(id) {
        return db_1.db.blogs.find(blog => blog.id === id);
    }
    static addBlog(blog) {
        const newBlog = Object.assign({ id: new Date().getTime().toString() }, blog);
        db_1.db.blogs.push(newBlog);
        return newBlog;
    }
    static updateBlog(id, blog) {
        const blogToUpdate = db_1.db.blogs.find(blog => blog.id === id);
        if (blogToUpdate) {
            blogToUpdate.name = blog.name;
            blogToUpdate.description = blog.description;
            blogToUpdate.websiteUrl = blog.websiteUrl;
        }
        return;
    }
    static deleteBlog(id) {
        db_1.db.blogs = db_1.db.blogs.filter(blog => blog.id !== id);
    }
}
exports.BlogRepository = BlogRepository;
