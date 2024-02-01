import express, {Response} from "express";
import {LoginInputModel} from "../models/auth/input";
import {HTTP_STATUSES, RequestBodyType} from "../models/common";
import {authValidation} from "../validators/auth-validation";
import {AuthService} from "../domain/auth-service";

export const authRoute = express.Router({});

const {NO_CONTENT, UNAUTHORIZED} = HTTP_STATUSES;
authRoute.post('/login', authValidation(), async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const isLogin = await AuthService.login({loginOrEmail, password});
    isLogin ? res.sendStatus(NO_CONTENT) : res.sendStatus(UNAUTHORIZED);
});
