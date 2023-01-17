"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicView = exports.sessionView = exports.errorView = void 0;
const log_1 = __importDefault(require("../models/log"));
const errorView = async (queryObject, limit, page, _) => {
    return await log_1.default.aggregate([
        { $match: {
                stackTrace: { $exists: true }
            } },
        { $group: {
                _id: {
                    name: "$name",
                    message: "$message",
                    stackTrace: "$stackTrace",
                },
                totalErrors: {
                    $sum: 1
                },
                browserVersion: {
                    $addToSet: "$browserVersion",
                },
                sessions: {
                    $addToSet: "$sessionId",
                },
            } },
        { $sort: {
                "_id.name": 1, "_id.message": 1
            } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: {
                _id: 0,
                name: "$_id.name",
                message: "$_id.message",
                stack: "$_id.stackTrace",
                totalSessions: { $size: "$sessions" },
                totalErrors: 1,
                browserVersion: 1
            }
        }
    ]);
};
exports.errorView = errorView;
const sessionView = async (queryObject, limit, page, timestampOptions) => {
    return await log_1.default.aggregate([
        { $match: queryObject },
        { $group: {
                _id: { sessionId: "$sessionId" },
                date: { $min: "$timestamp" },
                totalErrors: {
                    $sum: 1
                },
                errors: {
                    $addToSet: {
                        stack: "$stackTrace",
                        sessionId: "$sessionId",
                        name: "$name",
                        message: "$message",
                        actions: "$actions",
                        browserVersion: "$browserVersion",
                        timestamp: { $dateToString: Object.assign({ date: "$timestamp" }, timestampOptions) }
                    }
                }
            } },
        { $sort: {
                "date": -1, "_id.sessionId": -1
            } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: {
                _id: 0,
                sessionId: "$_id.sessionId",
                timestamp: { $dateToString: Object.assign({ date: "$timestamp" }, timestampOptions) },
                totalErrors: 1,
                errors: 1
            } }
    ]);
};
exports.sessionView = sessionView;
const atomicView = async (queryObject, limit, page, timestampOptions) => {
    return await log_1.default.aggregate([
        { $match: queryObject },
        { $sort: { sessionId: 1, timeStamp: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: {
                _id: 0,
                sessionId: 1,
                timestamp: { $dateToString: Object.assign({ date: "$timestamp" }, timestampOptions) },
                name: 1,
                message: 1,
                stackTrace: 1,
                browserVersion: 1,
                actions: 1
            } }
    ]);
};
exports.atomicView = atomicView;
