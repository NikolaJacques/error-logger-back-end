import express, { Express } from 'express';
import bodyparser from 'body-parser';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

dotenv.config();

const app:Express = express();
app.use(bodyparser.json());

mongoose.connect(process.env.MONGO_URI ?? '')
    .then(() => console.log('DB Connection successful'))
    .catch(err => console.log(err));

app.listen(3000);

