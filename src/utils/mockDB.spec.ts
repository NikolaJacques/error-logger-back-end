import { MONGO_TEST_URI } from './env';
import mongoose from 'mongoose';
import User, { UserInterface } from '../models/user';
import Project from '../models/project';
import Log from '../models/log';
import * as bcrypt from 'bcryptjs';

export const setup = async (SECRET:string, newUser: Partial<UserInterface> = {
    name: 'Bob', 
    email: 'bobsburgers@cc.com',
    password: '0123456789'
}) => {
    try{
        const uri = MONGO_TEST_URI ?? '';
        await mongoose.connect(uri);
        const user = new User({...newUser, password: await bcrypt.hash(newUser.password!,12)});
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