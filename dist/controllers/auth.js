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
const uuid_1 = require("uuid");
const jwt = __importStar(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const authenticate = async (req, res, next) => {
    try {
        const project = await project_1.default.findById(req.body.appId);
        if (!project) {
            const err = new Error();
            err.message = 'Project query unsuccessful; appId returned no results.';
            err.statusCode = 404;
            throw err;
        }
        if (req.body.appSecret !== project.secret) {
            const err = new Error();
            err.message = 'Authentication unsuccessful; wrong credentials.';
            err.statusCode = 403;
            throw err;
        }
        const sessionId = (0, uuid_1.v4)();
        const token = jwt.sign({
            appId: req.body.appId,
            sessionId
        }, env_1.JWT_SECRET !== null && env_1.JWT_SECRET !== void 0 ? env_1.JWT_SECRET : '');
        res.status(200).json({
            message: 'Authentication successful.',
            token,
            timestampOtions: project.timestampOptions
        });
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const login = (_, _2, _3) => { };
exports.login = login;
