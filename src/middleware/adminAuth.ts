import { RequestHandler } from 'express';
import { ErrorResponseType } from '../utils/sharedTypes';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_ADMIN_SECRET } from '../utils/env';

export const auth:RequestHandler = (req, _, next) => {
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
        (req as typeof req & {userId: string}).userId = userId;
        next();
    }
    catch(err){
        next(err);
    }
};