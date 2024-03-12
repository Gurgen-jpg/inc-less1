import {Router} from "express";
import {HTTP_STATUSES} from "../models/common";
import {SessionRepository} from "../repositories/session-repository";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {SessionService} from "../domain/session-service";
import {refreshTokenMiddleware} from "../middlewares/authValidation/refresh-token-validation";

export const securityRoute = Router({});

const {OK, UNAUTHORIZED, NO_CONTENT, NOT_FOUND} = HTTP_STATUSES;

securityRoute.get('/devices', refreshTokenMiddleware, async (req, res) => {
    const cookies = req.cookies;
    const result = await SessionService.getAllSessions(cookies['refreshToken']!);
    if (result.status !== 200) {
        return res.sendStatus(UNAUTHORIZED)
    }
    const devices = result.data;
    return res.status(OK).send(devices);
});

securityRoute.delete('/devices', refreshTokenMiddleware, async (req, res) => {
    const result = await SessionService.deleteAllSessions(req.context!.session?.deviceId!);
    if (result.status !== 204) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res.sendStatus(NO_CONTENT);
});

securityRoute.delete('/devices/:deviceId', refreshTokenMiddleware, async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await SessionService.deleteSession({deviceId:req.params.deviceId, refreshToken});
    if (result.status === 404) {
        return res.sendStatus(NOT_FOUND)
    } else if (result.status !== 204) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res.sendStatus(NO_CONTENT);
})
