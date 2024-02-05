"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_TYPES = exports.EAvailableResolutions = exports.HTTP_STATUSES = void 0;
exports.HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
var EAvailableResolutions;
(function (EAvailableResolutions) {
    EAvailableResolutions["P144"] = "P144";
    EAvailableResolutions["P240"] = "P240";
    EAvailableResolutions["P360"] = "P360";
    EAvailableResolutions["P480"] = "P480";
    EAvailableResolutions["P720"] = "P720";
    EAvailableResolutions["P1080"] = "P1080";
    EAvailableResolutions["P1440"] = "P1440";
    EAvailableResolutions["P2160"] = "P2160";
})(EAvailableResolutions || (exports.EAvailableResolutions = EAvailableResolutions = {}));
var AUTH_TYPES;
(function (AUTH_TYPES) {
    AUTH_TYPES["BASIC"] = "Basic";
    AUTH_TYPES["BEARER"] = "Bearer";
})(AUTH_TYPES || (exports.AUTH_TYPES = AUTH_TYPES = {}));
