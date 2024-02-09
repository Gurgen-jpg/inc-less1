import express, {Request, Response} from "express";
import {usersValidation} from "../validators/users-validator";
import {UsersService} from "../domain/users-service";
import {HTTP_STATUSES, RequestBodyType, RequestWithQueryType, UserQueryModel} from "../models/common";
import {UserInputModel} from "../models/users/input";
import {ObjectId} from "mongodb";
import {basicAuthorizationMiddleware} from "../middlewares/authValidation/basic-authorization";

const {OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST} = HTTP_STATUSES;
export const usersRoute = express.Router({});

usersRoute.get('/', basicAuthorizationMiddleware, async (req: RequestWithQueryType<Partial<UserQueryModel>>, res: Response) => {
    const query = req.query;
    const users = await UsersService.getAllUsers(query)
    return res.status(OK).send(users);
})

usersRoute.post('/', basicAuthorizationMiddleware, usersValidation(), async (req: RequestBodyType<UserInputModel>, res: Response) => {
    const user = await UsersService.createUser(req.body);
    user ? res.status(CREATED).send(user) : res.sendStatus(BAD_REQUEST);
})

usersRoute.delete('/:id', basicAuthorizationMiddleware, async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) return res.sendStatus(NOT_FOUND);
    const id = req.params.id;
    const result = await UsersService.deleteUser(id);
    return result ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
})
