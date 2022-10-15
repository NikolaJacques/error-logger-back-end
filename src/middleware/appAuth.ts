import {RequestHandler} from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

export const auth:RequestHandler = (req, res, next) => {
    try {
        const token = req.get('Authorization')!.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET ?? '');
        if (!decodedToken){
            return res.status(401).json({
                message: 'Could not authenticate; request failed.'
            });
        }
        (req.body as any).appId = (decodedToken as JwtPayload).appId;
        (req.body as any).sessionId = (decodedToken as JwtPayload).sessionId;
        next();
    }
    catch(err){
        next(err);
    }
};