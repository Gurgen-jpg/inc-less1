import {blogCollection, postCollection} from "../db/db";
import {BlogInputModel} from "../models/blogs/input";
import {blogMapper} from "../models/blogs/mappers/mapper";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/blogs/output";

export class BlogRepository {
    static async getAllBlogs(): Promise<BlogViewModel[] | null> {
        try {
            return await blogCollection.find({}).toArray()
                .then(res => res.map(blogMapper));
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getBlogById(id: string): Promise<BlogViewModel | boolean> {
        try {
            const blog = await blogCollection
                .findOne({_id: ObjectId.createFromHexString(id)})
            if (blog) {
                return blogMapper(blog);
            }
            return false;
        } catch (error) {
            console.error('Error in getBlogById:', error);
            return false;
        }
    }

    static async addBlog(blog: BlogInputModel): Promise<BlogViewModel | boolean> {
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
            return false;
        }
    }

    static async updateBlog(id: string, blog: BlogInputModel): Promise<Boolean> {
        try {
            const blogId = ObjectId.createFromHexString(id);
            const result = await blogCollection.updateOne(
                { _id: blogId },
                {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
                    }
                }
            );

            if (result.modifiedCount === 1) {
                return true;
            } else {
                console.warn('No document found for the provided id.');
                return false;
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            return false;
        }
    }

    static async deleteBlog(id: string) {
        try {
            const blogIsDeleted = await blogCollection.deleteOne({_id: ObjectId.createFromHexString(id)});
            await postCollection.deleteMany({blogId: id});
            return blogIsDeleted.deletedCount === 1;
        } catch (error) {
            console.error('Error in deleteBlogById:', error);
            return false;
        }
    }
}
