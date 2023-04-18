"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
const throwError = (messageString, statusCode) => {
    const err = new Error();
    err.message = messageString;
    err.statusCode = statusCode;
    throw err;
};
exports.throwError = throwError;
