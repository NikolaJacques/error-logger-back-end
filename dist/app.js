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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose = __importStar(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const log_1 = __importDefault(require("./routes/log"));
const projects_1 = __importDefault(require("./routes/projects"));
const path_1 = __importDefault(require("path"));
const project_1 = __importDefault(require("./models/project"));
const user_1 = __importDefault(require("./models/user"));
const env_1 = require("./utils/env");
const changeStream_1 = require("./utils/changeStream");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/auth', auth_1.default);
app.use('/logs', log_1.default);
app.use('/projects', projects_1.default);
app.use((err, _, res, _2) => {
    const message = err.message ? err.message : 'Unknown Server error';
    const statusCode = err.statusCode ? err.statusCode : 500;
    console.log(err);
    res.status(statusCode).json({ message });
});
mongoose.connect(env_1.MONGO_URI !== null && env_1.MONGO_URI !== void 0 ? env_1.MONGO_URI : '')
    .then(() => console.log('DB Connection successful'))
    .catch(err => console.log(err));
(0, changeStream_1.changeStreamHandler)();
(async () => {
    try {
        const project = await project_1.default.findById('635d4399854b53aa6a6a4f0a');
        if (!project) {
            await project_1.default.create({
                secret: '1234567890',
                name: 'test project'
            });
            console.log('test project created');
        }
        const user = await user_1.default.findById('63c822cf3ba3c07a9049ee9a');
        if (!user) {
            await user_1.default.create({
                name: 'test user',
                email: 'user@test.com',
                role: 'super admin',
                password: '$2a$12$Z3fkC3WIL8dUX36rL3qtve7qTdZZx3RauPRUGRWZ9e0swA.c7UD9O',
                projects: [new mongoose.Types.ObjectId('635d4399854b53aa6a6a4f0a')]
            });
            console.log('test user created');
        }
    }
    catch (error) {
        console.log(error);
    }
})();
app.listen(8080);
