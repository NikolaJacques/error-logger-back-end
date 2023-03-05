import { MongoClient, ChangeStreamInsertDocument } from 'mongodb';
import { MONGO_URI } from './env';
import Log from '../models/log';
import Project from '../models/project';
import { eventHandler } from './eventHandler';
import Event, { EventInterface } from '../models/event';
import { ErrorLogInterface } from 'frontend-backend';

export type EventType = 'newLog'; // update as union type as required

const pipeline = [{$match: {"operationType": "insert"}}];

export const changeStreamHandler = async () => {
  try {
      const client = new MongoClient(MONGO_URI!);
      const logs = client.db('errors').collection('logs');
      const storedToken = await client.db('errors').collection('token').findOne({_id: 'resume_token'});
      const changeStream = storedToken ? logs.watch(pipeline, {resumeAfter: storedToken.token}) : logs.watch(pipeline);
      changeStream.on('change', async (next:ChangeStreamInsertDocument) => {
        const resumeToken = (next as ChangeStreamInsertDocument & {_id: {_data: string}})._id;
        await client.db('errors').collection('token').findOneAndUpdate({_id: 'resume_token'},{$set:{token: resumeToken}},{upsert:true});
        const events = [];
        // check for new error log
        const searchExpression = next.fullDocument.stack.split('at')[0] + next.fullDocument.stack.split('at')[1];
        const queryObj = {
            $expr: {
                $eq: [
                    {$concat: [
                        { $arrayElemAt: [{$split: ["$stack", "at"]}, 0] },
                        { $arrayElemAt: [{$split: ["$stack", "at"]}, 1] },
                    ]},
                    searchExpression
                ]
            },
            _id: {$ne: next.fullDocument._id}
        }
        const likeErrors = await Log.find(queryObj);
        if (likeErrors.length===0){
            console.log('new error event');
            // events handler (queue all events that apply)
            events.push('newLog');
            // check if app subscribed to events
            const project = await Project.findOne({_id: next.fullDocument.appId}).populate<{events: any[]}>('events');
            let subscribedEvents: EventInterface[] = [];
            events.forEach(eventString => {
              let filteredEvents = project!.events.filter(event => {
                return event._doc.type === eventString;
              });
              subscribedEvents = [...filteredEvents, ...subscribedEvents]; 
            })
            // call handler for each event (exponential backoff and logging)
            if (subscribedEvents.length>0){
              subscribedEvents.forEach(event => eventHandler(event, next.fullDocument as ErrorLogInterface));
            }
        }
      });
      changeStream.on('error', async () => await changeStream.close().catch(err => {throw err}));
    } catch(err) {
      console.log(err);
    }
}