"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const logSchema = new mongoose_1.Schema({
    appId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stackTrace: {
        type: String,
        required: true
    },
    browserVersion: {
        type: String,
        required: true
    },
    timestamp: {
        type: String
    }
});
const Log = (0, mongoose_1.model)('Log', logSchema);
exports.default = Log;
