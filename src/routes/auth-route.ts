import express, {Response, Request} from "express";
import {LoginInputModel, RegisterInputModel} from "../models/auth/input";
import {HTTP_STATUSES, RequestBodyType} from "../models/common";
import {AuthService} from "../domain/auth-service";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {
    emailConfirmationValidation,
    registerValidation,
    resendEmailValidation
} from "../validators/registration-validation";

export const authRoute = express.Router({});

const {OK, NO_CONTENT, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;
authRoute.post('/login', async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const token = await AuthService.login({loginOrEmail, password});
    return token
        ? res.status(OK).send({accessToken: token})
        : res.sendStatus(UNAUTHORIZED);
});

authRoute.get('/me', tokenAuthorizationMiddleware, async (req: Request, res: Response) => {
    const me = await AuthService.me(req.context.user?.id!);
    return me ? res.status(OK).send(me) : res.sendStatus(NOT_FOUND);
})

authRoute.post('/registration', registerValidation(), async (req: RequestBodyType<RegisterInputModel>, res: Response) => {
    const {login, email, password} = req.body;
    const result = await AuthService.register({login, email, password});
    return result
        ? res.status(NO_CONTENT).send(result?.message)
        : res.sendStatus(BAD_REQUEST);
})

authRoute.post('/registration-confirmation', emailConfirmationValidation(), async (req: RequestBodyType<{
    code: string
}>, res: Response) => {
    const result = await AuthService.confirmEmail(req.body.code);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.send(BAD_REQUEST).send(result?.errorsMessages);
})

authRoute.post('/registration-email-resend', resendEmailValidation(), async (req: RequestBodyType<{
    email: string
}>, res: Response) => {
    const result = await AuthService.resendEmail(req.body.email);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.send(BAD_REQUEST).send(result?.errorsMessages);
})
