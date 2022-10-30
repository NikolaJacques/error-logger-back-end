import { postLog } from './log';
import Log from '../models/log';
import { MONGO_TEST_URI } from '../utils/env';
import mongoose from 'mongoose';
import Project from '../models/project';
import User from '../models/user';


describe("Log controller - post log", () => {

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

    test("returns log object in response", () => {
        let responseObject: any;
        const log = {
            message: 'test',
            name: 'test',
            stackTrace: 'test',
            browserVersion: 'test',
            timestamp: 'test',
            appId: 'test',
            sessionId: 'test'
        }
        const req: any = {
            body: log            
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
        const next: any = async () => {
            expect(responseObject).toHaveProperty('log');
            expect(await Log.findById(new mongoose.Types.ObjectId(responseObject.log._id))).toBeTruthy();
        }
        postLog(req, res, next);
    })
})