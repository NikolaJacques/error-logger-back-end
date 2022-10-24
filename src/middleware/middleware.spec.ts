import { auth } from './appAuth';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('App Auth Middleware', () => {

    test('should throw an error if no authorization header', () => {
        const req:any = {get: (_:string) => null};
        const res:any = {};
        const next:any = (error:Error) => {expect(error).not.toBeFalsy()};
        auth(req, res, next);
    });
    
    test('should throw an error if no token in Authorization header', () => {
        const req:any = {
            get: () => {
                return 'Bearer';
            },
            body: {}
        };
        const res:any = {};
        const next:any = (error:Error) => {expect(error).not.toBeFalsy()};
        auth(req, res, next);
    });

    test("should throw an error if invalid token", () => {
        const req:any = {
            get: () => {
                return 'Bearer xyz';
            },
            body: {}
        };
        const res:any = {};
        const next:any = (error:Error) => {
            expect(error).not.toBeFalsy();
            expect(error.message).toBe('Could not authenticate; request failed.')
        };
        auth(req, res, next);
    });
    
    test("should return a request object containing appId and sessionId", () => {
        const req:any = {
            get: () => {
                return 'Bearer xyz';
            },
            body: {}
        };
        const res:any = {};
        const next:any = () => {
            expect(req.body).toHaveProperty('appId');
            expect(req.body).toHaveProperty('appId', '1234');
        };
        const mockedVerify = (jwt as jest.Mocked<typeof import('jsonwebtoken')>).verify; 
        mockedVerify.mockImplementation(() => {
            return {
                appId: '1234',
                sessionId: '4567'
            }
        });
        auth(req, res, next);
        expect(mockedVerify).toHaveBeenCalled();
        mockedVerify.mockRestore();
    });

})


