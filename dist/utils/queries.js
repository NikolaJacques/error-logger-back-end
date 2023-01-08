"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicView = exports.sessionView = exports.errorView = void 0;
const log_1 = __importDefault(require("../models/log"));
const errorView = async (queryObject, limit, page, _) => {
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
const sessionView = async (queryObject, limit, page, timestampOptions) => {
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
        { $limit: limit },
        { $project: {
                _id: 0,
                date: { $dateToString: Object.assign({ date: "$date" }, timestampOptions) },
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
                timestamp: { $dateToString: Object.assign({ date: "$date" }, timestampOptions) },
                name: 1,
                message: 1,
                stackTrace: 1,
                browserVersion: 1
            } }
    ]);
};
exports.atomicView = atomicView;
