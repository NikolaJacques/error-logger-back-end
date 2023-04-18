import { NextFunction } from 'express';
import { AdminAuthRequest } from 'frontend-backend';
import { AuthResponse, AuthRequest, TypedRequest, TypedResponse, ErrorResponseType } from 'delivery-backend';
import Project from '../models/project';
import User from '../models/user';
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { JWT_ADMIN_SECRET, JWT_SECRET } from '../utils/env';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { throwError } from '../utils/throwError';
import { Types } from 'mongoose';

export const authenticate = async (req:TypedRequest<AuthRequest,any>, res:TypedResponse<AuthResponse>, next:NextFunction) => {
    try {
        const decodedToken = jwt.verify(req.body.appId, JWT_SECRET ?? '');
        if (!decodedToken){
            throwError('Could not authenticate; request failed.', 401);
        }
        const {appId} = (decodedToken as JwtPayload);
        const project = await Project.findById(new Types.ObjectId(appId));
        if (!project){
            throwError('Project query unsuccessful; appId returned no results.', 404);
        } else {
            if (appId!==project._id.toString()){
                throwError('Authentication unsuccessful; wrong credentials.', 401);
            }
        }
        const sessionId = uuid();
        const token = jwt.sign({
            appId,
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
            return throwError('Project query unsuccessful; appId returned no results.', 404);
        }
        const passwordOk = await bcrypt.compare(req.body.password, user.password);
        if (!passwordOk){
            throwError('Authentication unsuccessful; wrong credentials.', 401);
        }
        const token = jwt.sign({
            userId: user._id
        }, JWT_ADMIN_SECRET ?? '', {expiresIn: '1h'});
        res.status(200).json({
            message: 'Login successful.',
            token
        });
    }
    catch(err){
        next(err);
    }
};