"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const user_1 = __importDefault(require("../models/user"));
const Mongoose = __importStar(require("mongoose"));
const permissions = async (req, _, next) => {
    try {
        const userId = req.body.userId;
        const user = userId ? await user_1.default.findById(new Mongoose.Types.ObjectId(userId)) : null;
        if (!user) {
            const err = new Error();
            err.message = 'User not found.';
            err.statusCode = 404;
            throw err;
        }
        if (!user.projects.includes(new Mongoose.Types.ObjectId(req.params.id))) {
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
