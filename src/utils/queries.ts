import Log from '../models/log';
import { TimestampOptions } from 'intersection';

export interface queryObjectInterface {
    startDate: Date, 
    endDate: Date, 
    sessionId: string, 
    name: string
}

export const errorView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, _:TimestampOptions) => {
    const preCountStages = [
        {$match: queryObject},
        {$group: {
            _id: {
                name: "$name",
                message: "$message",
                stackTrace: "$stackTrace",
            },
            totalErrors: {
                $sum: 1
            },
            browserVersion: {
                $addToSet: "$browserVersion",
            },
            sessions: {
                $addToSet: "$sessionId",
            },
        }}];
    const total = await Log.aggregate([...preCountStages, {$count:"total"}]); 
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: {
            "_id.name":1, "_id.message":1
        }},
        {$skip: (page-1)*limit},
        {$limit: limit},
        {$project: {
            _id: 0,
            name: "$_id.name",
            message: "$_id.message",
            stack: "$_id.stackTrace",
            totalSessions: {$size: "$sessions"},
            totalErrors: 1,
            browserVersion: 1
          }
        }
    ]);
    return {logs, total:total[0].total};
};

export const sessionView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, timestampOptions:TimestampOptions) => {
    const preCountStages = [
        {$match: queryObject},
        {$group: {
            _id: {sessionId: "$sessionId"},
            date: {$min: "$timestamp"},
            totalErrors: {
                $sum: 1
            },
            errors: {
                $addToSet: {
                    stack:"$stackTrace",
                    sessionId: "$sessionId",
                    name: "$name",
                    message: "$message",
                    actions: "$actions",
                    browserVersion: "$browserVersion",
                    timestamp: {$dateToString: {
                        date:"$timestamp",
                        ...timestampOptions
                    }}
                }
            }
        }}];
    const total = await Log.aggregate([...preCountStages, {$count:"total"}]); 
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: {
            "date": -1, "_id.sessionId":-1
        }},
        {$skip: (page-1)*limit},
        {$limit: limit},
        {$project: {
            _id: 0,
            sessionId:"$_id.sessionId",
            timestamp: {$dateToString: {
                date:"$date",
                ...timestampOptions
            }},
            totalErrors:1,
            errors:1
        }}
    ]);
    return {logs, total:logs.length===0?0:total[0].total};
};

export const atomicView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, timestampOptions:TimestampOptions) => {
    const preCountStages = [{$match: queryObject}];
    const total = await Log.aggregate([...preCountStages, {$count:"total"}]); 
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: { sessionId: 1, timeStamp:-1}},
        {$skip: (page-1)*limit},
        {$limit: limit},
        {$project: {
            _id: 0,
            sessionId: 1,
            timestamp: {$dateToString: {
                date:"$timestamp",
                ...timestampOptions
            }},
            name:1,
            message:1,
            stackTrace:1,
            browserVersion:1,
            actions: 1
        }}
    ]);
    return {logs, total:total[0].total};
};