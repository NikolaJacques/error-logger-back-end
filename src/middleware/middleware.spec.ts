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
        const headers:any = {
            Authorization: 'Bearer'
        }
        const req:any = {
            get: (value:string) => {
                return headers[value];
            },
            headers
        };
        const res:any = {};
        const next:any = (error:Error) => {expect(error).not.toBeFalsy()};
        auth(req, res, next);
    });
    
    test("should return a request object containing appId and sessionId", () => {
        const headers:any = {
            Authorization: 'Bearer xyz'
        }
        const req:any = {
            get: (value:string) => {
                return headers[value];
            },
            headers
        };
        const res:any = {};
        const next:any = () => {};
        const mockedVerify = (jwt as jest.Mocked<typeof import('jsonwebtoken')>).verify; 
        mockedVerify.mockImplementation(() => {
            return {
                appId: '1234',
                sessionId: '4567'
            }
        });
        auth(req, res, next);
        expect(mockedVerify).toHaveBeenCalled();
        expect(req).toHaveProperty('appId');
        expect(req).toHaveProperty('appId', '1234');
        mockedVerify.mockRestore();
    });

})


