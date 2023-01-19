"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.createOrUpdateProject = exports.getProjects = exports.getProject = void 0;
const mongoose_1 = require("mongoose");
const project_1 = __importDefault(require("../models/project"));
const user_1 = __importDefault(require("../models/user"));
const getProject = async (req, res, next) => {
    try {
        const project = await project_1.default.findById(new mongoose_1.Schema.Types.ObjectId(req.params.id));
        if (!project) {
            const err = new Error();
            err.message = 'Project query unsuccessful; appId returned no results.';
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Projects retrieved successfully.',
            data: project
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProject = getProject;
const getProjects = async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({ _id: req.body.userId }).populate('projects');
        const projects = user.projects;
        if (projects.length === 0) {
            const err = new Error();
            err.message = 'This user has not yet registered any projects.';
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Projects retrieved successfully.',
            data: projects
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProjects = getProjects;
const createOrUpdateProject = async (req, res, next) => {
    try {
        const updatedData = req.body;
        const updatedProject = await project_1.default.findOneAndUpdate({ _id: req.params.id }, updatedData, { upsert: true });
        if (!updatedProject) {
            const err = new Error();
            err.message = 'Project query unsuccessful; appId returned no results.';
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Project updated successfully.',
            data: updatedProject
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createOrUpdateProject = createOrUpdateProject;
const deleteProject = async (req, res, _) => {
    const deletedProject = await project_1.default.findOneAndDelete({ _id: req.params.id });
    if (!deletedProject) {
        const err = new Error();
        err.message = 'Project query unsuccessful; appId returned no results.';
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Project deleted successfully.',
        data: deletedProject
    });
};
exports.deleteProject = deleteProject;
