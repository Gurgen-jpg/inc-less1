import express, {Response, Request} from "express";
import {LoginInputModel, RegisterInputModel} from "../models/auth/input";
import {HTTP_STATUSES, RequestBodyType} from "../models/common";
import {AuthService} from "../domain/auth-service";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {registerValidation} from "../validators/registration-validation";

export const authRoute = express.Router({});

const {OK, NO_CONTENT, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;
authRoute.post('/login', async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const token = await AuthService.login({loginOrEmail, password});
    return token
        ? res.status(OK).send({accessToken:token})
        : res.sendStatus(UNAUTHORIZED);
});

authRoute.get('/me', tokenAuthorizationMiddleware, async (req: Request, res: Response) => {
    const me = await AuthService.me(req.context.user?.id!);
    return me ? res.status(OK).send(me) : res.sendStatus(NOT_FOUND);
})

authRoute.post('/register', registerValidation(), async (req: RequestBodyType<RegisterInputModel>, res: Response) => {
    const {login, email, password} = req.body;
    const result = await AuthService.registerConfirm({login, email, password});
    return result
        ? res.sendStatus(NO_CONTENT)
        : res.sendStatus(BAD_REQUEST);
})

