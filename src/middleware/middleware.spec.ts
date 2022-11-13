import { appAuth as auth } from './appAuth';
import { adminAuth } from './adminAuth';
import {permissions} from './permissions';
import * as jwt from 'jsonwebtoken';
import {setup, cleanup} from '../utils/mockDB.spec';
import User from '../models/user';
import { ErrorResponseType } from '../utils/sharedTypes';

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

describe("Admin Auth Middleware", () => {

    test('should throw an error if no authorization header', () => {
        const req:any = {get: (_:string) => null};
        const res:any = {};
        const next:any = (error:Error) => {expect(error).not.toBeFalsy()};
        adminAuth(req, res, next);
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
        adminAuth(req, res, next);
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
        adminAuth(req, res, next);
    });

    test("should return a request object body with userId", () => {
        const req:any = {
            get: () => {
                return 'Bearer xyz';
            },
            body: {}
        };
        const res:any = {};
        const next:any = () => {
            expect(req.body).toHaveProperty('userId');
            expect(req.body).toHaveProperty('userId', '4567');
        };
        const mockedVerify = (jwt as jest.Mocked<typeof import('jsonwebtoken')>).verify; 
        mockedVerify.mockImplementation(() => {
            return {
                userId: '4567'
            }
        });
        adminAuth(req, res, next);
        expect(mockedVerify).toHaveBeenCalled();
        mockedVerify.mockRestore();
    });

});

describe("Permissions middleware", () => {

    let testProject:any;
    const SECRET = 'somesupersecret';
    const newUser = {
        name: 'Yolanda',
        email: 'yolo@basic.com',
        password: '123456'
    };

    beforeAll(async() => {return await setup(SECRET,newUser).then(project => testProject=project)});

    afterAll(async() => {return await cleanup()});

    test("should throw error if user not found", () => {
        const req:any = {
            body: {
                userId: '63711cb1236b456b5a01d7aa'
            }
        };
        const res:any = {};
        const next:any = (error:ErrorResponseType) => {
            error? console.log(error): null;
            expect(error).not.toBeFalsy();
            expect(error.statusCode).toBe(404)
        };
        permissions(req, res, next);
    });

    test("should throw error if user not authorized", async () => {
        const user = await User.findOne({name: newUser.name, email: newUser.email});
        const req:any = {
            body: {
                userId: user!._id
            }
        };
        const res:any = {};
        const next:any = (error:ErrorResponseType) => {
            error? console.log(error): null;
            expect(error).not.toBeFalsy();
            expect(error.statusCode).toBe(403)
        };
        permissions(req, res, next);
    });

    test("should not throw error if user authorized", async () => {
        const user = await User.findOne({name: newUser.name, email: newUser.email});
        user!.projects.push(testProject._id);
        await user!.save();
        const req:any = {
            body: {
                userId: user!._id
            },
            params: {
                id:testProject._id
            }
        };
        const res:any = {};
        const next:any = (error:ErrorResponseType) => {
            error? console.log(error): null;
            expect(error).toBeFalsy();
        };
        permissions(req, res, next);
    });

});


