export type CommentVewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus | null
    }
    likes:  LikeViewModel[]
}

export type LikeStatus = 'Like' | 'Dislike' | 'None';

export type LikeViewModel = {
    createdAt: string,
    status: LikeStatus,
    authorId: string
}
export type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentsOutputModel = CommentVewModel[]
