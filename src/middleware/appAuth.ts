import { NextFunction } from 'express';
import { ExtendedErrorLogType } from 'intersection';
import { ErrorResponseType, TypedRequest, TypedResponse } from 'delivery-backend';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';
import { throwError } from '../utils/throwError';

export const appAuth = (req: TypedRequest<ExtendedErrorLogType<number>,any>, _:TypedResponse<any>, next:NextFunction) => {
    try {
        const token = req.get('Authorization')!.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET ?? '');
        if (!decodedToken){
            throwError('Could not authenticate; request failed.', 401)
        }
        const { appId, sessionId } = (decodedToken as JwtPayload); 
        req.body.appId = appId;
        req.body.sessionId = sessionId;
        next();
    }
    catch(err){
        next(err);
    }
};