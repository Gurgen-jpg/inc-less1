import {PostDBModel} from "../../db";
import {PostViewModel} from "../output";
import {WithId} from "mongodb";

export const allPostsMapper = (post: WithId<PostDBModel>): PostViewModel => {
    return ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        isMembership: false
    })
}
