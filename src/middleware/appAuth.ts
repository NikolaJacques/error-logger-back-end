import {RequestHandler, Request} from 'express';
import { ErrorReportInterface } from '../utils/sharedTypes';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

interface RequestBodyInterface extends ErrorReportInterface {
    appId: string,
    sessionId: string
}

export const auth:RequestHandler = (req:Request<any, any, RequestBodyInterface>, res, next) => {
    try {
        const token = req.get('Authorization')!.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET ?? '');
        if (!decodedToken){
            return res.status(401).json({
                message: 'Could not authenticate; request failed.'
            });
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