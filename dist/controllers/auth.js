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
exports.login = exports.authenticate = void 0;
const project_1 = __importDefault(require("../models/project"));
const user_1 = __importDefault(require("../models/user"));
const uuid_1 = require("uuid");
const jwt = __importStar(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const bcrypt = __importStar(require("bcryptjs"));
const throwError_1 = require("../utils/throwError");
const mongoose_1 = require("mongoose");
const authenticate = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.body.appId, env_1.JWT_SECRET !== null && env_1.JWT_SECRET !== void 0 ? env_1.JWT_SECRET : '');
        if (!decodedToken) {
            (0, throwError_1.throwError)('Could not authenticate; request failed.', 401);
        }
        const { appId } = decodedToken;
        const project = await project_1.default.findById(new mongoose_1.Types.ObjectId(appId));
        if (!project) {
            (0, throwError_1.throwError)('Project query unsuccessful; appId returned no results.', 404);
        }
        else {
            if (appId !== project._id.toString()) {
                (0, throwError_1.throwError)('Authentication unsuccessful; wrong credentials.', 401);
            }
        }
        const sessionId = (0, uuid_1.v4)();
        const token = jwt.sign({
            appId,
            sessionId
        }, env_1.JWT_SECRET !== null && env_1.JWT_SECRET !== void 0 ? env_1.JWT_SECRET : '');
        res.status(200).json({
            message: 'Authentication successful.',
            token
        });
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const login = async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({ name: req.body.name });
        if (!user) {
            return (0, throwError_1.throwError)('Project query unsuccessful; appId returned no results.', 404);
        }
        const passwordOk = await bcrypt.compare(req.body.password, user.password);
        if (!passwordOk) {
            (0, throwError_1.throwError)('Authentication unsuccessful; wrong credentials.', 401);
        }
        const token = jwt.sign({
            userId: user._id
        }, env_1.JWT_ADMIN_SECRET !== null && env_1.JWT_ADMIN_SECRET !== void 0 ? env_1.JWT_ADMIN_SECRET : '', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful.',
            token
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
