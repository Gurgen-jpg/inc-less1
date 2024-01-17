import {Blogs, BlogViewModel} from "./blogs/output";
import {Posts, PostViewModel} from "./posts/output";

export type OutputViewModel = {
    blogs: Blogs,
    posts: Posts,
}

export type PostDBModel = Omit<PostViewModel, 'id'>;
export type BlogDBModel = Omit<BlogViewModel, 'id'>;

