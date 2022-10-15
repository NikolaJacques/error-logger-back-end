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
const bcrypt = __importStar(require("bcryptjs"));
const project_1 = __importDefault(require("../models/project"));
const uuidv4_1 = require("uuidv4");
const jwt = __importStar(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const authenticate = async (req, res, next) => {
    try {
        const project = await project_1.default.findById(req.body.appId).exec();
        if (!project) {
            return res.status(404).json({
                message: 'Project query unsuccessful; appId returned no results.',
                authenticated: false
            });
        }
        else {
            const credentialsOk = await bcrypt.compare(req.body.appSecret, project.secret);
            if (!credentialsOk) {
                return res.status(403).json({
                    message: 'Authentication unsuccessful; wrong credentials.',
                    authenticated: false
                });
            }
            else {
                const sessionId = (0, uuidv4_1.uuid)();
                if (!env_1.JWT_SECRET) {
                    throw new Error('JWT secret undefined, could not generate token.');
                }
                const token = jwt.sign({
                    appId: req.body.appId,
                    sessionId
                }, env_1.JWT_SECRET);
                res.status(200).json({
                    message: 'Authentication successful.',
                    authenticated: true,
                    token
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const login = (_, _2, _3) => { };
exports.login = login;
