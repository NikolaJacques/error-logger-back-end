import { NextFunction } from 'express';
import { AuthResponse, AuthRequest, AdminAuthRequest, ErrorResponseType, TypedRequest, TypedResponse } from '../utils/sharedTypes';
import Project from '../models/project';
import User from '../models/user';
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';
import * as bcrypt from 'bcryptjs';

export const authenticate = async (req:TypedRequest<AuthRequest,any>, res:TypedResponse<AuthResponse>, next:NextFunction) => {
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
            token
        });
    }
    catch(err){
        next(err);
    }
};

export const login = async (req:TypedRequest<AdminAuthRequest,any>, res:TypedResponse<AuthResponse>, next:NextFunction) => {
    try{
        const user = await User.findOne({name: req.body.name});
        if (!user){
            const err = new Error() as ErrorResponseType;
            err.message = 'User not found.'; 
            err.statusCode = 404;
            throw err;
        }
        const passwordOk = await bcrypt.compare(req.body.password, user.password);
        if (!passwordOk){
                const err = new Error() as ErrorResponseType;
                err.message = 'Authentication unsuccessful; wrong credentials.'; 
                err.statusCode = 403;
                throw err;
        }
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET ?? '', {expiresIn: '1h'});
        res.status(200).json({
            message: 'Login successful.',
            token
        });
    }
    catch(err){
        next(err);
    }
};