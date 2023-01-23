"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
    }
});
const Project = (0, mongoose_1.model)('Project', projectSchema);
exports.default = Project;
