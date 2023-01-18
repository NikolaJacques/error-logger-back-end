"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.addProject = exports.getProjects = exports.getProject = void 0;
const mongoose_1 = require("mongoose");
const project_1 = __importDefault(require("../models/project"));
const getProject = async (req, res, _) => {
    const project = await project_1.default.findById(new mongoose_1.Schema.Types.ObjectId(req.params.id));
    if (!project) {
        const err = new Error();
        err.message = 'Project query unsuccessful; appId returned no results.';
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Request successful.',
        data: project
    });
};
exports.getProject = getProject;
const getProjects = async (_, res, _2) => {
    const projects = await project_1.default.find({});
    if (projects.length === 0) {
        const err = new Error();
        err.message = 'Project query unsuccessful; appId returned no results.';
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Request successful.',
        data: projects
    });
};
exports.getProjects = getProjects;
const addProject = (_, _2, _3) => { };
exports.addProject = addProject;
const updateProject = (_, _2, _3) => { };
exports.updateProject = updateProject;
const deleteProject = (_, _2, _3) => { };
exports.deleteProject = deleteProject;
