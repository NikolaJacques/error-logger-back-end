"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    projects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project',
            default: []
        }]
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
