import { MONGO_TEST_URI } from '../utils/env';
import mongoose from 'mongoose';
import User from '../models/user';
import Project from '../models/project';
import Log from '../models/log';

export const setup = async (SECRET:string) => {
    try{
        const uri = MONGO_TEST_URI ?? '';
        await mongoose.connect(uri);
        const user = new User({
            name: 'Bob', 
            email: 'bobsburgers@cc.com',
            password: '0123456789'
        });
        await user.save();
        const project = new Project({
            name: 'test project', 
            secret: SECRET, 
            description: 'a project for doing stuff',
            timestampOptions: {
                format: '%Y-%m-%dT%H:%M:%S.%LZ',
                timezone: 'Europe/Brussels'
            }
        });
        await project.save();
        return project;
    }
    catch(err){
        console.log(err);
    }
}

export const cleanup = async () => {
    try {
        await Log.deleteMany({});
        await User.deleteMany({});
        await Project.deleteMany({});
        await mongoose.disconnect();
    }
    catch(err){
        console.log(err);
    }
}