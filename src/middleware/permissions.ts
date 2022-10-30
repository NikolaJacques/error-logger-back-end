import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ErrorResponseType } from '../utils/sharedTypes';
import User from '../models/user';
import {Schema} from 'mongoose';

export const permissions:RequestHandler = async (req, _, next) => {
    try {
        const user = await User.findById((req as typeof req & {userId:string}).userId);
        if (!user){
            const err = new Error() as ErrorResponseType;
            err.message = 'User not found.'; 
            err.statusCode = 404;
            throw err;
        }
        if (!user.projects.includes(new Schema.Types.ObjectId(req.params.id))){
            const err = new Error() as ErrorResponseType;
            err.message = 'User not authorized to access requested resource.'; 
            err.statusCode = 403;
            throw err;
        }
        next();
    }
    catch(err){
        next(err);
    }
};