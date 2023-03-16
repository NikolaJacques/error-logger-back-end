import { MongoClient, ChangeStreamInsertDocument } from 'mongodb';
import { MONGO_URI } from './env';
import Log from '../models/log';
import Project from '../models/project';
import { eventHandler } from './eventHandler';
import { EventInterface } from '../models/event';
import { ExtendedErrorLogType } from 'intersection';
import { ProjectInterface } from '../models/project';
import { PopulatedDoc } from 'mongoose';

export type EventType = 'newLog'; // expand as union type as new events are added

export interface EventHandlerEventInterface {_doc: EventInterface & {_id:string}};
type ResumeTokenType = ChangeStreamInsertDocument & {_id: {_data: string}};

const pipeline = [{$match: {"operationType": "insert"}}];

export const changeStreamHandler = async () => {
  try {
      const client = new MongoClient(MONGO_URI!);
      const logs = client.db('errors').collection('logs');
      const storedToken = await client.db('errors').collection('token').findOne({_id: 'resume_token'});
      const changeStream = storedToken ? logs.watch(pipeline, {resumeAfter: storedToken.token}) : logs.watch(pipeline);
      changeStream.on('change', async (next:ChangeStreamInsertDocument) => {
        const resumeToken = (next as ResumeTokenType)._id;
        await client.db('errors').collection('token').findOneAndUpdate({_id: 'resume_token'},{$set:{token: resumeToken}},{upsert:true});
        const eventsPipe = asyncPipe(checkForNewError/*insert other functions here for checking and adding events to events queue*/);
        const [_, events] = await eventsPipe(next,[] as EventType[]);
        // check if app subscribed to events
        const project = await Project.findOne({_id: next.fullDocument.appId}).populate<{events: any[]}>('events');
        const filteredEvents = subscribedEvents(project, events);
        // call handler for each event (exponential backoff and logging)
        await callEvents(next, filteredEvents);
      });
      changeStream.on('error', async () => await changeStream.close().catch(err => {throw err}));
    } catch(err) {
      console.log(err);
    }
  }

const asyncPipe = (...functions: any[]) => (next:ChangeStreamInsertDocument,events:EventType[]) => functions.reduce((chain, func) => chain.then(func), Promise.resolve([next,events]));

const checkForNewError = async (args:any[]):Promise<[ChangeStreamInsertDocument,EventType[]]> => {
  const next = args[0];
  const events = args[1];
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
    events.push('newLog');
  }
  return [next, events];
}

const subscribedEvents = (project: PopulatedDoc<ProjectInterface>, events: EventType[]) => {
  let result:EventInterface[] = [];
  events.forEach((eventString: EventType) => {
    let filteredEvents = project!.events.filter((event:EventInterface) => {
      return event!._doc.type === eventString;
    });
    result = [...filteredEvents, ...result];
  })
  return [...result];
}

const callEvents = async (next: ChangeStreamInsertDocument, subscribedEvents: EventInterface[]) => {
  if (subscribedEvents.length>0){
    subscribedEvents.forEach(async (event) => await eventHandler(event, next.fullDocument as ExtendedErrorLogType<Date>));
  }
}