import {BlogInputModel} from "../models/blogs/input";
import {BlogViewModel} from "../models/blogs/output";
import {BlogRepository} from "../repositories/blog-repository";
import {BlogQueryRepository} from "../repositories/blog-query-repository";
import {BlogQueryRepoInputModel} from "../models/blogs/blogQueryRepoInputModel";
import {PaginationType} from "../models/common";
import {PostViewModel} from "../models/posts/output";
import {PostRepository} from "../repositories/post-repository";
import {PostQueryRepoInputModel} from "../models/posts/postQueryRepoInputModel";
import {PostQueryRepository} from "../repositories/post-query-repository";

type AddPostByBlogIdPayloadType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export class BlogServices {
    static async getAllBlogs(sortData: BlogQueryRepoInputModel): Promise<PaginationType<BlogViewModel> | null> {
        const payload = {
            sortBy: sortData.sortBy ?? 'createdAt',
            sortDirection: sortData.sortDirection ?? 'desc',
            pageNumber: sortData.pageNumber ? +sortData.pageNumber : 1,
            pageSize: sortData.pageSize ? +sortData.pageSize : 10,
            searchNameTerm: sortData.searchNameTerm ?? null
        }
        try {
            return await BlogQueryRepository.getAllBlogs(payload)
        } catch (error) {
            console.log('Error in Service getAllBlogs: ', error);
            return null;
        }
    }

    static async getBlogById(id: string): Promise<BlogViewModel | null> {
        try {
            return await BlogQueryRepository.getBlogById(id)
        } catch (error) {
            console.error('Error in Service getBlogById:', error);
            return null;
        }
    }

    static async getPostsByBlogId(sortData: PostQueryRepoInputModel): Promise<PaginationType<PostViewModel> | null> {
        const payload = {
            sortBy: sortData.sortBy ?? 'createdAt',
            sortDirection: sortData.sortDirection ?? 'desc',
            pageNumber: sortData.pageNumber ? +sortData.pageNumber : 1,
            pageSize: sortData.pageSize ? +sortData.pageSize : 10,
            blogId: sortData.blogId
        }
        try {
            const blog = await BlogQueryRepository.getBlogById(payload.blogId!)
            if (!blog) {
                console.log('No blog found for the provided id.');
                return null
            }
            return await PostQueryRepository.getAllPosts(payload)
        } catch (error) {
            console.log('Error in Service getAllBlogs: ', error);
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

    static async addPostByBlogId(payload: AddPostByBlogIdPayloadType): Promise<PostViewModel | null> {
        const {title, shortDescription, content, blogId} = payload;
        const blogName = await BlogRepository.getBlogById(blogId).then(res => res?.name);
        try {
            if (!blogName) {
                console.log('No blog found for the provided id.');
                return null
            }
            const newPost = {
                title,
                shortDescription,
                content,
                blogId,
                blogName,
                createdAt: new Date().toISOString(),
            }
            const postId = await PostRepository.addPost(newPost);
            if (postId) {
                return await PostQueryRepository.getPostById(postId.insertedId.toString())
            } else {
                console.log('can not get recently added post with id: ', postId)
                return null
            }
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
