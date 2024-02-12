import {HTTP_STATUSES} from "../models/common";

type StatusType = keyof typeof HTTP_STATUSES;
export interface StatusCodeType<T> {
    statusCode: number;
    message: string;
    content?: T;
}
export const statusCodeService = <T>(statusCode: StatusType, content?: T): StatusCodeType<T> => {
    switch (statusCode) {
        case 'OK': {
            return {
                statusCode: 200,
                message: 'OK',
                content: content
            }
        }
        case 'CREATED': {
            return {
                statusCode: 201,
                message: 'Created',
                content: content
            }
        }
        case 'NO_CONTENT': {
            return {
                statusCode: 204,
                message: 'No Content'
            };
        }
        case 'BAD_REQUEST': {
            return {
                statusCode: 400,
                message: 'Bad Request'
            }
        }
        case "UNAUTHORIZED": {
            return {
                statusCode: 401,
                message: 'Unauthorized'
            }
        }
        case "FORBIDDEN": {
            return {
                statusCode: 403,
                message: 'Forbidden'
            }
        }
        case "NOT_FOUND": {
            return {
                statusCode: 404,
                message: 'Not Found'
            }
        }
        default: {
            return {
                statusCode: 500,
                message: 'Internal Server Error'
            };
        }
    }

}
