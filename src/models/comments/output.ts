export type CommentVewModel = {
    id: string
    content: string
    // postId: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}
export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentsOutputModel = CommentVewModel[]
