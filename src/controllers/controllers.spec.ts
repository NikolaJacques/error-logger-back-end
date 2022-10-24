import {authenticate} from './auth';
import { MONGO_TEST_URI } from '../utils/env';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import Project from '../models/project';
import User from '../models/user';
import { ErrorResponseType } from '../utils/sharedTypes';

describe("Auth controller - authenticate", () => {

    let testProject: any;
    const SECRET = 'somesupersecret';

    beforeAll(async () => {
        try{
            const uri = MONGO_TEST_URI ?? '';
            await mongoose.connect(uri);
            console.log('connection to test DB successful');
            const user = new User({
                name: 'Bob', 
                email: 'bobsburgers@cc.com'
            });
            await user.save();
            const project = new Project({
                name: 'test project', 
                secret: await bcrypt.hash(SECRET,12), 
                description: 'a project for doing stuff',
                user: user._id
            });
            await project.save();
            testProject = project;
        }
        catch(err){
            console.log(err);
        }
    })

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
                appId: testProject._id,
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
                appId: testProject._id,
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
        const next: any = () => {expect(responseObject).toHaveProperty('token')};
        authenticate(req, res, next);
    });

    afterAll(async () => {
        try {
            await User.deleteMany({});
            await Project.deleteMany({});
            await mongoose.disconnect();
        }
        catch(err){
            console.log(err);
        }
    })

})