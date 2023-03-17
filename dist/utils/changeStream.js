"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStreamHandler = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
const log_1 = __importDefault(require("../models/log"));
const project_1 = __importDefault(require("../models/project"));
const eventHandler_1 = require("./eventHandler");
;
const pipeline = [{ $match: { "operationType": "insert" } }];
const changeStreamHandler = async () => {
    try {
        const client = new mongodb_1.MongoClient(env_1.MONGO_URI);
        const logs = client.db('errors').collection('logs');
        const storedToken = await client.db('errors').collection('token').findOne({ _id: 'resume_token' });
        const changeStream = storedToken ? logs.watch(pipeline, { resumeAfter: storedToken.token }) : logs.watch(pipeline);
        changeStream.on('change', async (next) => {
            const resumeToken = next._id;
            await client.db('errors').collection('token').findOneAndUpdate({ _id: 'resume_token' }, { $set: { token: resumeToken } }, { upsert: true });
            const eventsPipe = asyncPipe(checkForNewError /*insert other functions here for checking and adding events to events queue*/);
            const [_, events] = await eventsPipe([next, []]);
            // check if app subscribed to events
            const project = await project_1.default.findOne({ _id: next.fullDocument.appId }).populate('events');
            const filteredEvents = subscribedEvents(project, events);
            // call handler for each event (exponential backoff and logging)
            await callEvents(next, filteredEvents);
        });
        changeStream.on('error', async () => await changeStream.close().catch(err => { throw err; }));
    }
    catch (err) {
        console.log(err);
    }
};
exports.changeStreamHandler = changeStreamHandler;
const asyncPipe = (...functions) => ([next, events]) => functions.reduce((chain, func) => chain.then((input) => Promise.resolve(func(input))), Promise.resolve([next, events]));
const checkForNewError = async ([next, events]) => {
    const searchExpression = next.fullDocument.stack.split('at')[0] + next.fullDocument.stack.split('at')[1];
    const queryObj = {
        $expr: {
            $eq: [
                { $concat: [
                        { $arrayElemAt: [{ $split: ["$stack", "at"] }, 0] },
                        { $arrayElemAt: [{ $split: ["$stack", "at"] }, 1] },
                    ] },
                searchExpression
            ]
        },
        _id: { $ne: next.fullDocument._id }
    };
    const likeErrors = await log_1.default.find(queryObj);
    if (likeErrors.length === 0) {
        events.push('newLog');
    }
    return [next, events];
};
const subscribedEvents = (project, events) => {
    let result = [];
    events.forEach((eventString) => {
        let filteredEvents = project.events.filter((event) => {
            return event._doc.type === eventString;
        });
        result = [...filteredEvents, ...result];
    });
    return [...result];
};
const callEvents = async (next, subscribedEvents) => {
    if (subscribedEvents.length > 0) {
        subscribedEvents.forEach(async (event) => await (0, eventHandler_1.eventHandler)(event, next.fullDocument));
    }
};
