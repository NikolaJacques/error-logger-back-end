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
            const events = [];
            // check for new error log
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
                console.log('new error event');
                // events handler (queue all events that apply)
                events.push('newLog');
                // check if app subscribed to events
                const project = await project_1.default.findOne({ _id: next.fullDocument.appId }).populate('events');
                let subscribedEvents = [];
                events.forEach(eventString => {
                    let filteredEvents = project.events.filter(event => {
                        return event._doc.type === eventString;
                    });
                    subscribedEvents = [...filteredEvents, ...subscribedEvents];
                });
                // call handler for each event (exponential backoff and logging)
                if (subscribedEvents.length > 0) {
                    subscribedEvents.forEach(event => (0, eventHandler_1.eventHandler)(event, next.fullDocument));
                }
            }
        });
        changeStream.on('error', async () => await changeStream.close().catch(err => { throw err; }));
    }
    catch (err) {
        console.log(err);
    }
};
exports.changeStreamHandler = changeStreamHandler;
