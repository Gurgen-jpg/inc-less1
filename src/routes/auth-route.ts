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
import {cookie} from "express-validator";
import {refreshTokenMiddleware} from "../middlewares/authValidation/refresh-token-validation";
import {rateLimitMiddleware} from "../middlewares/rateLimit/rate-limit-middleware";

export const authRoute = express.Router({});

const {OK, NO_CONTENT, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;
authRoute.post('/login', rateLimitMiddleware, async (req: RequestBodyType<LoginInputModel>, res: Response) => {
    const {loginOrEmail, password} = req.body;
    const token = await AuthService.login({loginOrEmail, password}, {
        ip: req.ip! as string,
        title: req.headers['user-agent'] as string
    })
    if (!token || !token.accessToken || !token.refreshToken) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res
        .cookie('refreshToken', token?.refreshToken, {httpOnly: true, secure: true})
        .header('Cache-Control', 'no-cache')
        .status(OK).send({accessToken: token?.accessToken})


});

authRoute.post('/logout', refreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(UNAUTHORIZED)
    }
    const result = await AuthService.logout(refreshToken);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.status(UNAUTHORIZED).send(result?.errors);
})

authRoute.post('/refresh-token', refreshTokenMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(UNAUTHORIZED)
    }
    const token = await AuthService.refreshToken(refreshToken, {
        ip: req.ip! as string,
        title: req.headers['user-agent'] as string
    });
    if (!token || !token.accessToken || !token.refreshToken) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res
        .cookie('refreshToken', token?.refreshToken, {httpOnly: true, secure: true})
        .header('Cache-Control', 'no-cache')
        .status(OK).send({accessToken: token?.accessToken})
})

authRoute.get('/me', tokenAuthorizationMiddleware, async (req: Request, res: Response) => {
    const me = await AuthService.me(req.context.user?.id!);
    return me ? res.status(OK).send(me) : res.sendStatus(NOT_FOUND);
})

authRoute.post('/registration', rateLimitMiddleware, registerValidation(), async (req: RequestBodyType<RegisterInputModel>, res: Response) => {
    const {login, email, password} = req.body;
    const result = await AuthService.register({login, email, password});
    return result?.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.status(BAD_REQUEST).send(result?.errors);
})

authRoute.post('/registration-confirmation', rateLimitMiddleware, emailConfirmationValidation(), async (req: RequestBodyType<{
    code: string
}>, res: Response) => {
    const result = await AuthService.confirmEmail(req.body.code);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.status(BAD_REQUEST).send(result?.errors);
})

authRoute.post('/registration-email-resending', rateLimitMiddleware, resendEmailValidation(), async (req: RequestBodyType<{
    email: string
}>, res: Response) => {
    const result = await AuthService.resendEmail(req.body.email);
    return result.status === 204
        ? res.status(NO_CONTENT).send(result?.message)
        : res.status(BAD_REQUEST).send(result?.errors);
})
