"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogs = exports.postLog = exports.getLogs = void 0;
const log_1 = __importDefault(require("../models/log"));
const queries_1 = require("../utils/queries");
const getLogs = async (req, res, next) => {
    try {
        const { startDate, endDate, sessionId, name, page, limit, view } = req.query;
        let queryObject = { _id: req.params.id };
        if (startDate && endDate) {
            queryObject = Object.assign(Object.assign({}, queryObject), { timeStamp: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                } });
        }
        ;
        if (sessionId) {
            queryObject = Object.assign(Object.assign({}, queryObject), { sessionId });
        }
        ;
        if (name) {
            queryObject = Object.assign(Object.assign({}, queryObject), { name });
        }
        ;
        let logs;
        switch (view) {
            case 'atomic':
                logs = await (0, queries_1.atomicView)(parseInt(limit), parseInt(page));
            case 'session':
                logs = await (0, queries_1.sessionView)(queryObject, parseInt(limit), parseInt(page));
            case 'error':
                logs = await (0, queries_1.errorView)(queryObject, parseInt(limit), parseInt(page));
            default:
                logs = await log_1.default.find(queryObject).sort({ sessionId: -1, timeStamp: 1 });
        }
        ;
        if (logs.length === 0) {
            return res.status(404).json({
                message: 'No errors found.'
            });
        }
        ;
        res.status(200).json({
            message: 'Logs retrieved successfully',
            logs
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getLogs = getLogs;
const postLog = async (req, res, next) => {
    try {
        const logObj = Object.assign(Object.assign({}, req.body), { timestamp: new Date(req.body.timestamp) });
        const log = new log_1.default(logObj);
        await log.save();
        res.status(200).json({
            message: 'Log successfully saved.',
            log
        });
    }
    catch (err) {
        next(err);
    }
};
exports.postLog = postLog;
const deleteLogs = (_, _2, _3) => { };
exports.deleteLogs = deleteLogs;
