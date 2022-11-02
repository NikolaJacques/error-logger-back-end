"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = exports.setup = void 0;
const env_1 = require("../utils/env");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const project_1 = __importDefault(require("../models/project"));
const log_1 = __importDefault(require("../models/log"));
const setup = async (SECRET) => {
    try {
        const uri = env_1.MONGO_TEST_URI !== null && env_1.MONGO_TEST_URI !== void 0 ? env_1.MONGO_TEST_URI : '';
        await mongoose_1.default.connect(uri);
        const user = new user_1.default({
            name: 'Bob',
            email: 'bobsburgers@cc.com',
            password: '0123456789'
        });
        await user.save();
        const project = new project_1.default({
            name: 'test project',
            secret: SECRET,
            description: 'a project for doing stuff',
            timestampOptions: {
                format: '%Y-%m-%dT%H:%M:%S.%LZ',
                timezone: 'Europe/Brussels'
            }
        });
        await project.save();
        return project;
    }
    catch (err) {
        console.log(err);
    }
};
exports.setup = setup;
const cleanup = async () => {
    try {
        await log_1.default.deleteMany({});
        await user_1.default.deleteMany({});
        await project_1.default.deleteMany({});
        await mongoose_1.default.disconnect();
    }
    catch (err) {
        console.log(err);
    }
};
exports.cleanup = cleanup;
