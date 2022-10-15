import { RequestHandler } from 'express';
import { AuthResponse, AuthRequest } from '../utils/sharedTypes';
import * as bcrypt from 'bcryptjs';
import Projects from '../models/project';
import { uuid } from 'uuidv4';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const authenticate:RequestHandler<any, AuthResponse, AuthRequest> = async (req, res, next) => {
    try {
        const project = await Projects.findById(req.body.appId).exec();
        if (!project){
            return res.status(404).json({
                message: 'Project query unsuccessful; appId returned no results.',
                authenticated: false
            });
        } else {
            const credentialsOk = await bcrypt.compare(req.body.appSecret, project.secret);
            if (!credentialsOk){
                return res.status(403).json({
                    message: 'Authentication unsuccessful; wrong credentials.',
                    authenticated: false
                });
            } else {
                const sessionId = uuid();
                if (!JWT_SECRET){throw new Error('JWT secret undefined, could not generate token.')}
                const token = jwt.sign({
                    appId: req.body.appId,
                    sessionId
                }, JWT_SECRET);
                res.status(200).json({
                    message: 'Authentication successful.',
                    authenticated: true,
                    token
                });
            }
        }
    }
    catch(err){
        next(err);
    }
};

export const login: RequestHandler<any, AuthResponse, AuthRequest> = (_, _2, _3) => {};