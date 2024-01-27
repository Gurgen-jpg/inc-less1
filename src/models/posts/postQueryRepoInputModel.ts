export type PostQueryRepoInputModel = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    blogId?: string
}

export type PostSortDataType = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    blogId?: string
}
