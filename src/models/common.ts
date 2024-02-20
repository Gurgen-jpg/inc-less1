import {Request} from "express";

export const HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
} as const;

export enum EAvailableResolutions {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160",
}

export enum AUTH_TYPES {
    BASIC = 'Basic',
    BEARER = 'Bearer'
}

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null | number
    createdAt: string
    publicationDate: string
    availableResolutions: EAvailableResolutions[]
}

export type StatusResultType = {
    status: number
    message?: string
    errorsMessages?: ErrorsMessageType
}

export interface idKeys {
    id: 'id',
    postId: 'postId',
    blogId: 'blogId',
}

export type Param<T extends keyof idKeys> = {
    [key in T]: string;
}


export type BlogSortDataType = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}

export type CommentsSortDataType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}
export type UserQueryModel = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}

export type PaginationType<I> = {
    "pageSize": number,
    "page": number,
    "pagesCount": number,
    "totalCount": number,
    "items": Array<I>
}
export type RequestParamType<P> = Request<P, unknown, unknown, unknown>;
export type RequestParamAndQueryType<P,Q> = Request<P, unknown, unknown, Q>;
export type RequestBodyType<B> = Request<unknown, unknown, B, unknown>;
export type RequestWithQueryType<Q> = Request<unknown, unknown, unknown, Q>;

export type RequestBodyWithParamsType<P, B> = Request<P, unknown, B, unknown>;

export type ErrorType = {
    message: string
    field: string
}
export type ErrorsMessageType = ErrorType[];
