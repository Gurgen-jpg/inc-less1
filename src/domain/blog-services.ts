import {BlogInputModel} from "../models/blogs/input";
import {BlogViewModel} from "../models/blogs/output";
import {BlogRepository} from "../repositories/blog-repository";

export class BlogServices {
    static async getAllBlogs(): Promise<BlogViewModel[] | null> {
        try {
            return await BlogRepository.getAllBlogs()
        } catch (error) {
            console.log('Error in Service getAllBlogs: ', error);
            return null;
        }
    }

    static async getBlogById(id: string): Promise<BlogViewModel | null> {
        try {
            return await BlogRepository.getBlogById(id)
        } catch (error) {
            console.error('Error in Service getBlogById:', error);
            return null;
        }
    }

    static async addBlog(blog: BlogInputModel): Promise<BlogViewModel | null> {
        try {
            const newBlog = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            }
            return await BlogRepository.addBlog(newBlog);
        } catch (e) {
            console.log('Error in Service addBlog:', e);
            return null;
        }
    }

    static async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        try {
            return await BlogRepository.updateBlog(id, blog);
        } catch (error) {
            console.error('Error in Service updating blog:', error);
            return false;
        }
    }

    static async deleteBlog(id: string): Promise<boolean> {
        try {
           return await BlogRepository.deleteBlog(id)
        } catch (error) {
            console.error('Error in Service deleteBlogById:', error);
            return false;
        }
    }
}
