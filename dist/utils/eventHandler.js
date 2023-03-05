"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const webhookLogs_1 = __importDefault(require("../models/webhookLogs"));
const delay_1 = require("./delay");
const eventHandler = async (event, payload) => {
    try {
        const fetch = async () => await axios_1.default.post(event._doc.endPointUrl, payload, { validateStatus: status => !(status >= 400 && status < 600) || [400, 408].includes(status) });
        let response = await fetch();
        let backoffCoefficient = 0;
        while (response.status >= 400 && backoffCoefficient < 10) {
            ++backoffCoefficient;
            await (0, delay_1.delay)(backoffCoefficient);
            response = await fetch();
        }
        const newLog = await webhookLogs_1.default.create({ eventId: event._id, status: response.status, payload });
        await newLog.save();
    }
    catch (err) {
        const newLog = await webhookLogs_1.default.create({ eventId: event._id, status: err.response.status, payload });
        await newLog.save();
    }
};
exports.eventHandler = eventHandler;
