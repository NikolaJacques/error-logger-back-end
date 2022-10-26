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
exports.setupProject = void 0;
const env_1 = require("./env");
const bcrypt = __importStar(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const project_1 = __importDefault(require("../models/project"));
const user_1 = __importDefault(require("../models/user"));
const setupProject = (secret = 'testSecret') => {
    let testProject;
    let SECRET = secret;
    beforeAll(async () => {
        try {
            const uri = env_1.MONGO_TEST_URI !== null && env_1.MONGO_TEST_URI !== void 0 ? env_1.MONGO_TEST_URI : '';
            await mongoose_1.default.connect(uri);
            console.log('connection to test DB successful');
            const user = new user_1.default({
                name: 'Bob',
                email: 'bobsburgers@cc.com'
            });
            await user.save();
            const project = new project_1.default({
                name: 'test project',
                secret: await bcrypt.hash(SECRET, 12),
                description: 'a project for doing stuff',
                user: user._id
            });
            await project.save();
            testProject = project;
        }
        catch (err) {
            console.log(err);
        }
    });
    afterAll(async () => {
        try {
            await user_1.default.deleteMany({});
            await project_1.default.deleteMany({});
            await mongoose_1.default.disconnect();
        }
        catch (err) {
            console.log(err);
        }
    });
    return Promise.resolve(testProject);
};
exports.setupProject = setupProject;
