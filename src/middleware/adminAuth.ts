import { TypedRequest, TypedResponse, AdminAuthRequest } from '../utils/sharedTypes';
import { NextFunction } from 'express';
import { ErrorResponseType } from '../utils/sharedTypes';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_ADMIN_SECRET } from '../utils/env';

export const adminAuth = (req:TypedRequest<AdminAuthRequest,any>, _:TypedResponse<any>, next:NextFunction) => {
    try {
        const token = req.get('Authorization')!.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_ADMIN_SECRET ?? '');
        if (!decodedToken){
            const err = new Error() as ErrorResponseType;
            err.message = 'Could not authenticate; request failed.'; 
            err.statusCode = 401;
            throw err;
        }
        const { userId } = (decodedToken as JwtPayload); 
        req.body.userId = userId;
        next();
    }
    catch(err){
        next(err);
    }
};