import {db} from "../db/db";
import {BlogInputModel} from "../models/blogs/input";

export class BlogRepository {
    static getAllBlogs() {
        return db.blogs;
    }

    static getBlogById(id: string) {
        return db.blogs.find(blog => blog.id === id);
    }

    static addBlog(blog: BlogInputModel) {
        const newBlog = {
            id: new Date().getTime().toString(),
            ...blog
        }
        db.blogs.push(newBlog);
        return newBlog;
    }

    static updateBlog(id: string, blog: BlogInputModel) {
        const blogToUpdate = db.blogs.find(blog => blog.id === id);
        if (blogToUpdate) {
            blogToUpdate.name = blog.name;
            blogToUpdate.description = blog.description;
            blogToUpdate.websiteUrl = blog.websiteUrl;

        }
        return;
    }

    static deleteBlog(id: string) {
        db.blogs = db.blogs.filter(blog => blog.id !== id);
    }
}
