"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogs = exports.postLog = exports.getLogs = void 0;
const log_1 = __importDefault(require("../models/log"));
const getLogs = async (_, res, next) => {
    try {
        // add query parameter handling
        // add pagination
        const logs = await log_1.default.find({});
        if (logs.length === 0) {
            return res.status(404).json({
                message: 'No logs found.'
            });
        }
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
        const logObj = req.body;
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
