import express, {Response, Request} from "express";
import {LoginInputModel} from "../models/auth/input";
import {HTTP_STATUSES, RequestBodyType} from "../models/common";
import {authValidation} from "../validators/auth-validation";
import {AuthService} from "../domain/auth-service";
import {authMiddleware} from "../middlewares/authValidation/auth-middleware";

export const authRoute = express.Router({});

const {OK, NO_CONTENT, UNAUTHORIZED} = HTTP_STATUSES;
authRoute.post('/login', async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const token = await AuthService.login({loginOrEmail, password});
    return token
        ? res.status(OK).send({token})
        : res.sendStatus(UNAUTHORIZED);
});

authRoute.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const me = await AuthService.me(req.context.user?.id!);
    res.send(me);
})
