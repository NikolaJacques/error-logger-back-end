import express, { Express } from 'express';
import bodyparser from 'body-parser';

const app:Express = express();

app.use(bodyparser.json());

app.listen(3000);

