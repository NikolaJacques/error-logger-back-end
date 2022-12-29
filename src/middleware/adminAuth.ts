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
        const { userId } = (decodedToken as JwtPayload); 
        req.body.userId = userId;
        next();
    }
    catch(_){
        const error = new Error() as ErrorResponseType;
        error.message = 'Could not authenticate; request failed.'; 
        error.statusCode = 401;
        next(error);
    }
};