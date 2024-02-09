import express, {Response, Request} from "express";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";

export const commentsRoute = express.Router({});

commentsRoute.delete('/:id', tokenAuthorizationMiddleware, async (req: Request, res: Response) => {

})
commentsRoute.put('/:id', tokenAuthorizationMiddleware, async (req: Request, res: Response) => {

})
commentsRoute.get('/:id', async (req: Request, res: Response) => {

})
