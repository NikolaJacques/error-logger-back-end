import { RequestHandler } from 'express';
import { AuthResponse, AuthRequest, ErrorResponseType } from '../utils/sharedTypes';
import Project from '../models/project';
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const authenticate:RequestHandler<any, AuthResponse, AuthRequest> = async (req, res, next) => {
    try {
        const project = await Project.findById(req.body.appId);
        if (!project){
            const err = new Error() as ErrorResponseType;
            err.message = 'Project query unsuccessful; appId returned no results.'; 
            err.statusCode = 404;
            throw err;
        }
        if (req.body.appSecret!==project.secret){
                const err = new Error() as ErrorResponseType;
                err.message = 'Authentication unsuccessful; wrong credentials.'; 
                err.statusCode = 403;
                throw err;
        }
        const sessionId = uuid();
        const token = jwt.sign({
            appId: req.body.appId,
            sessionId
        }, JWT_SECRET ?? '');
        res.status(200).json({
            message: 'Authentication successful.',
            token,
            timestampOtions: project.timestampOptions
        });
    }
    catch(err){
        next(err);
    }
};

export const login: RequestHandler<any, AuthResponse, AuthRequest> = (_, _2, _3) => {};