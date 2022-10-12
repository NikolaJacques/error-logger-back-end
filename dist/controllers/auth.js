"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const authenticate = (_, _2, _3) => {
    // check MongoDB projects collection for project id
    // decrypt project secret and compare
    // generate jwt token from app id + Date.now() if equal and send back
    // send error response if not equal
};
exports.authenticate = authenticate;
