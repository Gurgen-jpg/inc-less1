import {Blogs, BlogViewModel} from "./blogs/output";
import {Posts, PostViewModel} from "./posts/output";
import {Users, UserViewModel} from "./users/output";

export type OutputViewModel = {
    blogs: Blogs,
    posts: Posts,
    users: Users
}
export type UserDBModel = Omit<UserViewModel, 'id'> & {password: string};
export type PostDBModel = Omit<PostViewModel, 'id'>;
export type BlogDBModel = Omit<BlogViewModel, 'id'>;

