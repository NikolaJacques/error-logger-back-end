import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import * as mongoose from 'mongoose';
import authRoutes from './routes/auth';
import logRoutes from './routes/log';
import projectRoutes from './routes/projects';
import path from 'path';
import Project from './models/project';
import User from './models/user';
import { MONGO_URI } from './utils/env';
import { changeStreamHandler } from './utils/changeStream';

const app:Express = express();
app.use(bodyparser.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/logs', logRoutes);
app.use('/projects', projectRoutes);

app.use((err: Error & {message: string, statusCode: number}, _: Request, res: Response, _2: NextFunction) => {
    const message = err.message ? err.message : 'Unknown Server error';
    const statusCode = err.statusCode ? err.statusCode : 500;
    console.log(err);
    res.status(statusCode).json({ message });
});

mongoose.connect(MONGO_URI ?? '')
    .then(() => console.log('DB Connection successful'))
    .catch(err => console.log(err));

changeStreamHandler();

(async () => {
    try {
        const project = await Project.findById('635d4399854b53aa6a6a4f0a');
        if (!project){
            await Project.create({
            secret: '1234567890',
            name: 'test project'
            });
            console.log('test project created');
        }
        const user = await User.findById('63c822cf3ba3c07a9049ee9a');
        if(!user){
            await User.create({
                name: 'test user',
                email: 'user@test.com',
                role: 'super admin',
                password: '$2a$12$Z3fkC3WIL8dUX36rL3qtve7qTdZZx3RauPRUGRWZ9e0swA.c7UD9O',
                projects: [new mongoose.Types.ObjectId('635d4399854b53aa6a6a4f0a')]
            });
            console.log('test user created');
        }
    }
    catch(error){
        console.log(error);
    }
})();

app.listen(8080);

