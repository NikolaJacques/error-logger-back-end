import express, { Express, Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import logRoutes from './routes/log';
import path from 'path';

dotenv.config();

const app:Express = express();
app.use(bodyparser.json());

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', logRoutes);

app.use((err: Error, _: Request, res: Response, _2: NextFunction) => {
    res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.MONGO_URI ?? '')
    .then(() => console.log('DB Connection successful'))
    .catch(err => console.log(err));

app.listen(3000);

