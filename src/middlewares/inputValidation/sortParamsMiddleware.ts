import {Response, NextFunction} from 'express'
import {BlogSortDataType, RequestWithQueryType, UserQueryModel} from "../../models/common";

type CommonSortType = UserQueryModel & BlogSortDataType
export const sortParamsMiddleware = (req: RequestWithQueryType<CommonSortType>, res: Response, next: NextFunction) => {
    req.query = {
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageSize: req.query.pageSize ? +req.query.pageSize : 10,
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            searchLoginTerm: req.query.searchLoginTerm ?? null,
            searchEmailTerm: req.query.searchEmailTerm ?? null,
            searchNameTerm: req.query.searchNameTerm ?? null
        }


    return next();
}
