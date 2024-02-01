"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoute = void 0;
const express_1 = __importDefault(require("express"));
const users_validator_1 = require("../validators/users-validator");
const users_service_1 = require("../domain/users-service");
const auth_middleware_1 = require("../middlewares/authValidation/auth-middleware");
const common_1 = require("../models/common");
const mongodb_1 = require("mongodb");
const { OK, CREATED, NO_CONTENT, NOT_FOUND, BAD_REQUEST } = common_1.HTTP_STATUSES;
exports.usersRoute = express_1.default.Router({});
exports.usersRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const users = yield users_service_1.UsersService.getAllUsers(query);
    return res.status(OK).send(users);
}));
exports.usersRoute.post('/', auth_middleware_1.authMiddleware, (0, users_validator_1.usersValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.UsersService.createUser(req.body);
    user ? res.status(CREATED).send(user) : res.sendStatus(BAD_REQUEST);
}));
exports.usersRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(req.params.id))
        return res.sendStatus(NOT_FOUND);
    const id = req.params.id;
    const result = yield users_service_1.UsersService.deleteUser(id);
    return result ? res.sendStatus(NO_CONTENT) : res.sendStatus(NOT_FOUND);
}));
