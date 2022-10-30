import { RequestHandler } from 'express';
import { ErrorReportInterface, ErrorResponseType } from '../utils/sharedTypes';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env';

interface RequestBodyInterface extends ErrorReportInterface {
    appId: string,
    sessionId: string
}

interface ResponseBodyInterface {
    message: string
}

export type AuthFunctionType = RequestHandler<unknown, ResponseBodyInterface, RequestBodyInterface>;

export const auth:AuthFunctionType = (req, _, next) => {
    try {
        const token = req.get('Authorization')!.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET ?? '');
        if (!decodedToken){
            const err = new Error() as ErrorResponseType;
            err.message = 'Could not authenticate; request failed.'; 
            err.statusCode = 401;
            throw err;
        }
        const { appId, sessionId } = (decodedToken as JwtPayload); 
        (req.body as RequestBodyInterface).appId = appId;
        (req.body as RequestBodyInterface).sessionId = sessionId;
        next();
    }
    catch(err){
        next(err);
    }
};