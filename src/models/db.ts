import {Blogs, BlogViewModel} from "./blogs/output";
import {Posts, PostViewModel} from "./posts/output";
import {Users, UserViewModel} from "./users/output";
import {CommentVewModel} from "./comments/output";

export type OutputViewModel = {
    blogs: Blogs,
    posts: Posts,
    users: Users
}
export type UserDBModel = {
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
};
export type PostDBModel = Omit<PostViewModel, 'id'>;
export type BlogDBModel = Omit<BlogViewModel, 'id'>;
export type CommentDBModel = Omit<CommentVewModel, 'id'> & {postId: string};

