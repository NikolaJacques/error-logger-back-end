"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncPipe = void 0;
function asyncPipe(...fns) {
    return (x) => fns.reduce(async (y, fn) => fn(await y), x);
}
exports.asyncPipe = asyncPipe;
