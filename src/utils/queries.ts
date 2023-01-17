import Log from '../models/log';
import { TimestampOptions } from './sharedTypes';

export interface queryObjectInterface {
    startDate: Date, 
    endDate: Date, 
    sessionId: string, 
    name: string
}

export const errorView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, _:TimestampOptions) => {
    return await Log.aggregate([
        {$match: {
            stackTrace : {$exists: true}
        }},
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
        }},
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
};

export const sessionView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, timestampOptions:TimestampOptions) => {
    return await Log.aggregate([
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
        }},
        {$sort: {
            "date": -1, "_id.sessionId":-1
        }},
        {$skip: (page-1)*limit},
        {$limit: limit},
        {$project: {
            _id: 0,
            sessionId:1,
            timestamp: {$dateToString: {
                date:"$timestamp",
                ...timestampOptions
            }},
            totalErrors:1,
            errors:1
        }}
    ]);
};

export const atomicView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number, timestampOptions:TimestampOptions) => {
    return await Log.aggregate([
        {$match: queryObject},
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
};