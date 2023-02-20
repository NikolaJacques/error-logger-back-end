"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomicView = exports.sessionView = exports.errorView = void 0;
const log_1 = __importDefault(require("../models/log"));
const _ = __importStar(require("lodash"));
const errorView = async (queryObject, limit, page, _1) => {
    const preCountStages = [
        { $match: queryObject },
        { $group: {
                _id: {
                    name: "$name",
                    message: "$message",
                    stackTrace: { $concat: [
                            { $arrayElemAt: [{ $split: ["$stackTrace", "at"] }, 0] },
                            { $arrayElemAt: [{ $split: ["$stackTrace", "at"] }, 1] }
                        ] },
                },
                stacks: { $addToSet: "$stackTrace" },
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
                stack: "$stacks",
                totalSessions: { $size: "$sessions" },
                totalErrors: 1,
                browserVersion: 1
            }
        }
    ]);
    const stackFilter = (array) => {
        const arr = [];
        for (let item of array) {
            arr.push(item.split('at'));
        }
        return _.intersection(...arr).join('at');
    };
    const aggregatedLogs = logs.map(log => (Object.assign(Object.assign({}, log), { stack: stackFilter(log.stack) })));
    return { logs: aggregatedLogs, total: logs.length === 0 ? 0 : total[0].total };
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
                stack: 1,
                browserVersion: 1,
                actions: 1
            } }
    ]);
    return { logs, total: logs.length === 0 ? 0 : total[0].total };
};
exports.atomicView = atomicView;
