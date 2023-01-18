import { RequestHandler } from 'express';
import { Schema } from 'mongoose';
import Project from '../models/project';
import { ErrorResponseType } from '../utils/sharedTypes';

export const getProject:RequestHandler = async (req, res, _) => {
    const project = await Project.findById(new Schema.Types.ObjectId(req.params.id));
    if (!project){
        const err = new Error() as ErrorResponseType;
        err.message = 'Project query unsuccessful; appId returned no results.'; 
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Request successful.',
        data: project
    });
};

export const getProjects: RequestHandler = async (_, res, _2) => {
    const projects = await Project.find({});
    if (projects.length===0){
        const err = new Error() as ErrorResponseType;
        err.message = 'Project query unsuccessful; appId returned no results.'; 
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Request successful.',
        data: projects
    });
}

export const addProject: RequestHandler = (_, _2, _3) => {};
export const updateProject: RequestHandler = (_, _2, _3) => {};
export const deleteProject: RequestHandler = (_, _2, _3) => {};