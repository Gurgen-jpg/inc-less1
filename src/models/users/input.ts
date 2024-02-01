export type UserInputModel = {
    login: string
    password: string
    email: string
    createdAt: string
}

export type UserQueryModel = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}
