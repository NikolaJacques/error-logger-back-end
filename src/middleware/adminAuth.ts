import { AdminAuthRequest } from 'frontend-backend';
import { NextFunction } from 'express';
import { TypedRequest, TypedResponse, ErrorResponseType } from 'delivery-backend';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_ADMIN_SECRET } from '../utils/env';
import { throwError } from '../utils/throwError';

export const adminAuth = (req:TypedRequest<AdminAuthRequest,any>, _:TypedResponse<any>, next:NextFunction) => {
    try {
        try {
            const token = req.get('Authorization')!.split(' ')[1];
            const decodedToken = jwt.verify(token, JWT_ADMIN_SECRET ?? '');
            const { userId } = (decodedToken as JwtPayload); 
            req.body.userId = userId;
            next();
        }
        catch(err){
            throwError('Could not authenticate; request failed.', 401);
        }
    }
    catch(error){
        next(error);
    }
};