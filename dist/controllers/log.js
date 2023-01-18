"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogs = exports.postLog = exports.getLogs = void 0;
const log_1 = __importDefault(require("../models/log"));
const queries_1 = require("../utils/queries");
const project_1 = __importDefault(require("../models/project"));
const getLogs = async (req, res, next) => {
    try {
        const { startDate, endDate, sessionId, name, page, limit, view } = req.query;
        let queryObject = { appId: req.params.id };
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
        const project = await project_1.default.findById(req.params.id);
        const timestampOptions = project.timestampOptions;
        let data;
        switch (view) {
            case 'atomic':
                data = await (0, queries_1.atomicView)({}, parseInt(limit), parseInt(page), timestampOptions);
                break;
            case 'session':
                data = await (0, queries_1.sessionView)(queryObject, parseInt(limit), parseInt(page), timestampOptions);
                break;
            case 'error':
                data = await (0, queries_1.errorView)(queryObject, parseInt(limit), parseInt(page), timestampOptions);
                break;
            default:
                data = await (0, queries_1.atomicView)({}, parseInt(limit), parseInt(page), timestampOptions);
        }
        ;
        if (data.total === 0) {
            return res.status(404).json({
                message: 'No logs found.'
            });
        }
        ;
        res.status(200).json({
            message: 'Logs retrieved successfully',
            total: data.total,
            logs: data.logs
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
