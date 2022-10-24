import {authenticate} from './auth';
import { MONGO_TEST_URI } from '../utils/env';
import mongoose from 'mongoose';
import Project from '../models/project';
import User from '../models/user';

describe("Auth controller - authenticate", () => {

    let testUser: any;
    let testProject: any;

    beforeAll( async () => {
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
                secret: 'somesupersecret', 
                description: 'a project for doing stuff',
                user: user._id
            });
            await project.save();
            testUser = user;
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
    })

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