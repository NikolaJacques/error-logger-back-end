"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicView = exports.sessionView = exports.errorView = void 0;
const log_1 = __importDefault(require("../models/log"));
const errorView = async (queryObject, limit, page) => {
    return await log_1.default.aggregate([
        { $match: queryObject },
        { $group: {
                _id: { name: "$name", message: "$message", stackTrace: "$stackTrace" },
                totalErrors: { $count: "$name" },
                totalSessions: { $count: "$sessionId" },
                browserVersions: {
                    $addToSet: {
                        browserVersion: "$browserVersion"
                    }
                }
            } },
        { $sort: {
                "_id.name": 1, "_id.message": 1
            } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]);
};
exports.errorView = errorView;
const sessionView = async (queryObject, limit, page) => {
    return await log_1.default.aggregate([
        { $match: queryObject },
        { $group: {
                _id: { sesionId: "$sessionId" },
                date: { $min: "$timestamp" },
                totalErrors: { $count: "$name" },
                errors: {
                    $addToSet: {
                        stackTrace: "$stackTrace"
                    }
                }
            } },
        { $sort: {
                "date": -1, "_id.sessionId": -1
            } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]);
};
exports.sessionView = sessionView;
const atomicView = async (limit, page) => {
    return await log_1.default.aggregate([
        { $match: {} },
        { $sort: { sessionId: 1, timeStamp: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]);
};
exports.atomicView = atomicView;
