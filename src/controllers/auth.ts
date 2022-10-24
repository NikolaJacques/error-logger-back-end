import { RequestHandler } from 'express';
import { AuthResponse, AuthRequest, ErrorResponseType } from '../utils/sharedTypes';
import * as bcrypt from 'bcryptjs';
import Projects from '../models/project';
import { uuid } from 'uuidv4';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const authenticate:RequestHandler<any, AuthResponse, AuthRequest> = async (req, res, next) => {
    try {
        const project = await Projects.findById(req.body.appId).exec();
        if (!project){
            const err = new Error() as ErrorResponseType;
            err.message = 'Project query unsuccessful; appId returned no results.'; 
            err.statusCode = 404;
            throw err;
        }
        const credentialsOk = await bcrypt.compare(req.body.appSecret, project.secret);
        if (!credentialsOk){
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
            authenticated: true,
            token
        });
    }
    catch(err){
        next(err);
    }
};

export const login: RequestHandler<any, AuthResponse, AuthRequest> = (_, _2, _3) => {};