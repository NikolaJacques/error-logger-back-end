"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const event_1 = __importDefault(require("./event"));
const projectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    timestampOptions: {
        type: Object,
        required: false,
        default: {
            format: "%d-%m-%Y",
            timezone: "Europe/Brussels"
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    events: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: event_1.default
        }]
});
const Project = (0, mongoose_1.model)('Project', projectSchema);
exports.default = Project;
