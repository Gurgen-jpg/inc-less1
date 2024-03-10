import {Router} from "express";
import {HTTP_STATUSES} from "../models/common";
import {SessionRepository} from "../repositories/session-repository";
import {tokenAuthorizationMiddleware} from "../middlewares/authValidation/token-authorization";
import {SessionService} from "../domain/session-service";

export const securityRoute = Router({});

const {OK, UNAUTHORIZED, NO_CONTENT} = HTTP_STATUSES;

securityRoute.get('/devices', tokenAuthorizationMiddleware, async (req, res) => {
    const result = await SessionService.getAllSessions(req.context!.user!.id!);
    if (result.status !== 200) {
        return res.sendStatus(UNAUTHORIZED)
    }
    const devices = result.data;
    return res.status(OK).send(devices);
});

securityRoute.delete('/devices', tokenAuthorizationMiddleware, async (req, res) => {
    const result = await SessionService.deleteAllSessions(req.context!.session?.deviceId!);
    if (result.status !== 204) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res.sendStatus(NO_CONTENT);
});

securityRoute.delete('/devices/:deviceId', tokenAuthorizationMiddleware, async (req, res) => {
    const result = await SessionService.deleteSession(req.params.deviceId);
    if (result.status !== 204) {
        return res.sendStatus(UNAUTHORIZED)
    }
    return res.sendStatus(NO_CONTENT);
})
