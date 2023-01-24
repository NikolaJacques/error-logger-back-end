import { RequestHandler } from 'express';
import { Schema } from 'mongoose';
import Project from '../models/project';
import { ErrorResponseType } from 'delivery-backend';
import { ProjectRequest } from 'frontend-backend';
import User from '../models/user';

export const getProject:RequestHandler = async (req, res, next) => {
    try {
        const project = await Project.findById(new Schema.Types.ObjectId(req.params.id));
        if (!project){
            const err = new Error() as ErrorResponseType;
            err.message = 'Project query unsuccessful; appId returned no results.'; 
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Projects retrieved successfully.',
            data: project
        });
    }
    catch(err){
        next(err);
    }
};

export const getProjects: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({_id:req.body.userId}).populate('projects');
        const projects = user!.projects;
        if (projects.length===0){
            const err = new Error() as ErrorResponseType;
            err.message = 'This user has not yet registered any projects.'; 
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Projects retrieved successfully.',
            data: projects
        });
    }
    catch(err){
        next(err);
    }
}

export const createOrUpdateProject: RequestHandler = async (req, res, next) => {
    try {
        const updatedData = req.body as ProjectRequest;
        const updatedProject = await Project.findOneAndUpdate({_id:req.params.id}, updatedData, {upsert: true});
        if (!updatedProject){
            const err = new Error() as ErrorResponseType;
            err.message = 'Project query unsuccessful; appId returned no results.'; 
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Project updated successfully.',
            data: updatedProject
        });
    }
    catch(err){
        next(err);
    }
};

export const deleteProject: RequestHandler = async (req, res, _) => {
    const deletedProject = await Project.findOneAndDelete({_id: req.params.id});
    if (!deletedProject){
        const err = new Error() as ErrorResponseType;
        err.message = 'Project query unsuccessful; appId returned no results.'; 
        err.statusCode = 404;
        throw err;
    }
    res.status(200).json({
        message: 'Project deleted successfully.',
        data: deletedProject
    });
};