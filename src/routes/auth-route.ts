import express, {Response} from "express";
import {LoginInputModel} from "../models/auth/input";
import {RequestBodyType} from "../models/common";
import {authValidation} from "../validators/auth-validation";
import {AuthService} from "../domain/auth-service";

export const authRoute = express.Router({});

authRoute.post('/login', authValidation, async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    await AuthService.login({loginOrEmail, password});
})
