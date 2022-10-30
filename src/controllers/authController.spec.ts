import {authenticate} from './auth';
import { ErrorResponseType } from '../utils/sharedTypes';
import { MONGO_TEST_URI } from '../utils/env';
import mongoose from 'mongoose';
import Project from '../models/project';
import User from '../models/user';
import Log from '../models/log';

describe("Auth controller - authenticate", () => {

    let testProject:any;
    const SECRET = 'testSecret';

    beforeAll(async () => {
        try{
            const uri = MONGO_TEST_URI ?? '';
            await mongoose.connect(uri);
            const user = new User({
                name: 'Bob', 
                email: 'bobsburgers@cc.com'
            });
            await user.save();
            const project = new Project({
                name: 'test project', 
                secret: SECRET, 
                description: 'a project for doing stuff',
                user: user._id
            });
            await project.save();
            testProject = project;
        }
        catch(err){
            console.log(err);
        }
    });

    afterAll(async () => {
        try {
            await Log.deleteMany({});
            await User.deleteMany({});
            await Project.deleteMany({});
            await mongoose.disconnect();
        }
        catch(err){
            console.log(err);
        }
    });

    test("db returns test project", async () => {
        const project = await Project.findById(testProject._id);
        expect(project).not.toBeFalsy();
        expect(project!._id.toString()).toBe(testProject._id.toString());
    });

    test("throws error if project doesn't exist", async () => {
        const id = new mongoose.Types.ObjectId();
        const req: any = {
            body: {
                appId: id
            }
        };
        const res: any = {};
        const next: any = (error: ErrorResponseType) => {
            expect(error).not.toBeFalsy();
            expect(error.statusCode).toBe(404);
        };
        authenticate(req, res, next);
    });

    test("throws error if incorrect credentials", async () => {
        const req: any = {
            body: {
                appId: new mongoose.Types.ObjectId(testProject._id),
                appSecret: 'randomstring'
            }
        };
        const res: any = {};
        const next: any = (error: ErrorResponseType) => {
            expect(error).not.toBeFalsy();
            expect(error.statusCode).toBe(403);
        };
        authenticate(req, res, next);
    });

    test("responds with token if authentication successful", async () => {
        let responseObject: unknown;
        const req: any = {
            body: {
                appId: new mongoose.Types.ObjectId(testProject._id),
                appSecret: SECRET
            }
        };
        const res: any = {
            status: () => {
                return {
                    json: jest.fn().mockImplementation((result) => {
                        responseObject = result;
                    })
                }
            }
        };
        const next: any = () => {
            expect(responseObject).toHaveProperty('token');
            expect((responseObject as any).token).not.toBeFalsy();
        };
        authenticate(req, res, next);
    });

})