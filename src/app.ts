import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import * as mongoose from 'mongoose';
import logRoutes from './routes/log';
import path from 'path';
import * as bcrypt from 'bcryptjs';
import Projects from './models/project';
import { MONGO_URI } from './utils/env';

const app:Express = express();
app.use(bodyparser.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/logs', logRoutes);

app.use((err: Error & {message: string, statusCode: number}, _: Request, res: Response, _2: NextFunction) => {
    const message = err.message ? err.message : 'Unknown Server error';
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({ message });
});

mongoose.connect(MONGO_URI ?? '')
    .then(() => console.log('DB Connection successful'))
    .catch(err => console.log(err));

(async () => {
    try {
        const project = await Projects.findById('634aca2bc0e1e983aef48b78').exec();
        if (!project){
            await Projects.create({
            secret: await bcrypt.hash('1234567890', 12),
            name: 'test project',
            email: 'user@test.com'
            });
            console.log('project created');
        }
    }
    catch(error){
        console.log(error);
    }
})();

app.listen(3000);

