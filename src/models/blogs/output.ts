export type BlogViewModel = {
    "id": string,
    "name": string,
    "description": string,
    "websiteUrl": string,
    "createdAt": string
    "isMembership": boolean
}
export type BlogsOutputModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": BlogViewModel[]
}

export type Blogs = BlogViewModel[];
