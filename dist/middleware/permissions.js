"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = require("mongoose");
const permissions = async (req, _, next) => {
    try {
        const user = await user_1.default.findById(req.userId);
        if (!user) {
            const err = new Error();
            err.message = 'User not found.';
            err.statusCode = 404;
            throw err;
        }
        if (!user.projects.includes(new mongoose_1.Schema.Types.ObjectId(req.params.id))) {
            const err = new Error();
            err.message = 'User not authorized to access requested resource.';
            err.statusCode = 403;
            throw err;
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.permissions = permissions;
