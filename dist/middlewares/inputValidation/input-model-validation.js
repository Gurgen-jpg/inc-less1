"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputModelValidation = void 0;
const express_validator_1 = require("express-validator");
const inputModelValidation = (req, res, next) => {
    const formattedErrors = (0, express_validator_1.validationResult)(req).formatWith((error) => {
    });
    return next();
};
exports.inputModelValidation = inputModelValidation;
