import {authenticate} from './auth';
import { ErrorResponseType } from '../utils/sharedTypes';
import mongoose from 'mongoose';
import Project from '../models/project';
import {setup, cleanup} from '../utils/mockDB';

describe("Auth controller - authenticate", () => {

    let testProject:any;
    const SECRET = 'testSecret';

    beforeAll(() => setup(SECRET).then(project => testProject=project));

    afterAll(() => cleanup());

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
        let responseObj:any;
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
                        responseObj = result;
                    })
                }
            }
        };
        const next: any = () => {};
        await authenticate(req, res, next).then(() => {
            expect(responseObj).toHaveProperty('token');
            expect((responseObj as any).token).not.toBeFalsy();
        });
    });

})