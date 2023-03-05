"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const webhookLogSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    payload: {
        type: Object,
        required: true,
        default: {}
    },
    timestamp: {
        type: Date,
        required: true,
        default: new Date()
    }
});
const WebhookLog = (0, mongoose_1.model)('WebhookLog', webhookLogSchema);
exports.default = WebhookLog;
