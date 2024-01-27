import {PostInputModel, PostUpdateModel} from "../models/posts/input";
import {PostViewModel} from "../models/posts/output";
import {PostRepository} from "../repositories/post-repository";
import {BlogRepository} from "../repositories/blog-repository";


export class PostServices {
    static async getAllPosts(): Promise<PostViewModel[] | null> {
        try {
            return await PostRepository.getAllPosts();
        } catch (error) {
            console.error('Error in getAllPosts:', error);
            return null
        }
    }

    static async getPostById(id: string): Promise<PostViewModel | null> {
        try {
            return await PostRepository.getPostById(id);
        } catch (error) {
            console.error('Error in getPostById:', error);
            return null
        }
    }

    static async addPost(post: PostInputModel): Promise<PostViewModel | null> {
        try {
            const blog = await BlogRepository.getBlogById(post.blogId)
            if (blog) {
                const newPost = {
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: blog.name,
                    createdAt: new Date().toISOString(),
                }
                return await PostRepository.addPost(newPost);
            } else {
                console.log('No blog found for the provided id.');
                return null
            }
        } catch (e) {
            console.log('Error in Service addPost:', e);
            return null;
        }
    }

    static async updatePost(id: string, post: PostUpdateModel): Promise<boolean> {
        try {
          return await PostRepository.updatePost(id, post)
        } catch (e) {
            console.log('Error in updatePost:', e);
            return false
        }
    }

    static async deletePost(id: string): Promise<boolean> {
        try {
          return await PostRepository.deletePost(id)
        } catch (e) {
            console.log('Error in deletePost:', e);
            return false
        }
    }
}
