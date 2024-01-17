import {blogCollection} from "../db/db";
import {BlogInputModel} from "../models/blogs/input";
import {blogMapper} from "../models/blogs/mappers/mapper";
import {BlogModel} from "../models/blogs/output";
import {ObjectId} from "mongodb";

export class BlogRepository {
    static async getAllBlogs(): Promise<BlogModel[] | null> {
        try {
            return await blogCollection.find({}).toArray()
                .then(res => res.map(blogMapper));
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getBlogById(id: string): Promise<BlogModel | null> {
        try {
            const blog = await blogCollection
                .findOne({_id: ObjectId.createFromHexString(id)})
            if (blog) {
                return blogMapper(blog);
            }
            return null;
        } catch (error) {
            console.error('Error in getBlogById:', error);
            return null;
        }
    }

    static async addBlog(blog: BlogInputModel): Promise<BlogModel | null> {
        try {
            const newBlog = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            }
            const blogId = await blogCollection.insertOne(newBlog);
            return await this.getBlogById(blogId.insertedId.toString());
        } catch (e) {
            console.log('Error in addBlog:', e);
            return null;
        }
    }

    static async updateBlog(id: string, blog: BlogInputModel): Promise<Boolean> {
        try {
            const blogId = ObjectId.createFromHexString(id);
            await blogCollection.updateOne({_id: blogId}, {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl
            })
            return true;
        } catch (error) {
            console.error('Can not update blog:', error);
            return false;
        }
    }

    static async deleteBlog(id: string): Promise<Boolean> {
        try {
            const result = await blogCollection.deleteOne({_id: ObjectId.createFromHexString(id)});
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error in deleteBlogById:', error);
            return false;
        }
    }
}
