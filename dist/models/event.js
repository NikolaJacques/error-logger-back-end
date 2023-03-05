"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true
    },
    endPointUrl: {
        type: String,
        required: true
    }
});
const Event = (0, mongoose_1.model)('Event', eventSchema);
exports.default = Event;
