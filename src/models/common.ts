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




export type Param = {
    id: number
}

export type BodyType = {
    title: string
    author: string
    availableResolutions?: EAvailableResolutions[]
    createdAt?: string;
}

export type RequestParamType<P> = Request<P, unknown, unknown, unknown>;

export type RequestBodyType<B> = Request<unknown, unknown, B, unknown>;

export type RequestBodyWithParamsType<P, B> = Request<P, unknown, B, unknown>;

export type ErrorType = {
    message: string
    field: string
}

export type ErrorsMessageType = ErrorType[];
