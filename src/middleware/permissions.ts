import { ErrorResponseType, TypedRequest, TypedResponse } from 'delivery-backend';
import { AdminAuthRequest } from 'frontend-backend';
import User from '../models/user';
import { Schema } from 'mongoose';
import { NextFunction } from 'express';

export const permissions = async (req: TypedRequest<AdminAuthRequest,any>, _:TypedResponse<any>, next:NextFunction) => {
    try {
        const userId = req.body.userId;
        const user = userId?await User.findById(new Schema.Types.ObjectId(userId)):null;
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