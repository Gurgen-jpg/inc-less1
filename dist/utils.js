"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.isValidISODate = exports.HTTP_STATUSES = void 0;
const settings_1 = require("./settings");
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
function isValidISODate(dateString) {
    if (typeof dateString !== 'string') {
        return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString();
}
exports.isValidISODate = isValidISODate;
function validation(payload) {
    let { title, author, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate } = payload.body;
    let tempVideo = {};
    const errors = [];
    if (!title || typeof title !== 'string' || title.trim().length > 40) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        });
    }
    if (!author || typeof author !== 'string' || author.trim().length > 20) {
        errors.push({
            message: "Incorrect author",
            field: "author"
        });
    }
    if (availableResolutions && Array.isArray(availableResolutions) && availableResolutions.length > 0) {
        availableResolutions === null || availableResolutions === void 0 ? void 0 : availableResolutions.forEach(resolution => {
            if (!Object.values(settings_1.EAvailableResolutions).includes(resolution)) {
                errors.push({
                    message: `Incorrect resolution: ${resolution}`,
                    field: "availableResolutions"
                });
                return;
            }
        });
    }
    else {
        tempVideo.availableResolutions = [];
    }
    if (minAgeRestriction && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({
            message: "Incorrect min age restriction",
            field: "minAgeRestriction"
        });
    }
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        errors.push({
            message: "Incorrect can be downloaded",
            field: "canBeDownloaded"
        });
    }
    if (publicationDate && (!isValidISODate(publicationDate))) {
        errors.push({
            message: "Incorrect publication date",
            field: "publicationDate"
        });
    }
    return ({ errorsMessages: errors, tempVideo });
}
exports.validation = validation;
