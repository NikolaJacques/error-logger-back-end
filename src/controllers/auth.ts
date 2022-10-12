import { RequestHandler } from 'express';
import { AuthResponse, AuthRequest } from '../sharedTypes/shared';

export const authenticate:RequestHandler<any, AuthResponse, AuthRequest> = (_, _2, _3) => {
    // check MongoDB projects collection for project id
    // decrypt project secret and compare
    // generate jwt token from app id + Date.now() if equal and send back
    // send error response if not equal
};