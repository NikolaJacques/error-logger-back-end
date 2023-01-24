"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicView = exports.sessionView = exports.errorView = void 0;
const log_1 = __importDefault(require("../models/log"));
const errorView = async (queryObject, limit, page, _) => {
    const preCountStages = [
        { $match: queryObject },
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
            } }
    ];
    const total = await log_1.default.aggregate([...preCountStages, { $count: "total" }]);
    const logs = await log_1.default.aggregate([
        ...preCountStages,
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
    return { logs, total: logs.length === 0 ? 0 : total[0].total };
};
exports.errorView = errorView;
const sessionView = async (queryObject, limit, page, timestampOptions) => {
    const preCountStages = [
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
            } }
    ];
    const total = await log_1.default.aggregate([...preCountStages, { $count: "total" }]);
    const logs = await log_1.default.aggregate([
        ...preCountStages,
        { $sort: {
                "date": -1, "_id.sessionId": -1
            } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: {
                _id: 0,
                sessionId: "$_id.sessionId",
                timestamp: { $dateToString: Object.assign({ date: "$date" }, timestampOptions) },
                totalErrors: 1,
                errors: 1
            } }
    ]);
    return { logs, total: logs.length === 0 ? 0 : total[0].total };
};
exports.sessionView = sessionView;
const atomicView = async (queryObject, limit, page, timestampOptions) => {
    const preCountStages = [{ $match: queryObject }];
    const total = await log_1.default.aggregate([...preCountStages, { $count: "total" }]);
    const logs = await log_1.default.aggregate([
        ...preCountStages,
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
    return { logs, total: logs.length === 0 ? 0 : total[0].total };
};
exports.atomicView = atomicView;
