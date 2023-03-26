import Log from '../models/log';
import { TimestampOptions } from 'intersection';
import * as _ from 'lodash';
import { PipelineStage } from 'mongoose';

export interface queryObjectInterface {
    startDate: Date, 
    endDate: Date, 
    sessionId: string, 
    name: string,
    stack: string
}

export const errorView = async(queryObject:Partial<queryObjectInterface>, limit:number|null, page:number|null, _1:TimestampOptions) => {
    const preCountStages = [
        {$match: queryObject},
        {$group: {
            _id: {
                name: "$name",
                message: "$message",
                stackTrace: {$concat: [
                    {$arrayElemAt: [{$split: ["$stackTrace", "at"]}, 0]}, 
                    {$arrayElemAt: [{$split: ["$stackTrace", "at"]}, 1]}
                ]},
            },
            stacks:{ $addToSet: "$stackTrace"},
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
    const limitPageStage:PipelineStage[] = [
        {$skip: page&&limit?(page-1)*(limit?limit:total[0].total):0},
        {$limit: limit?limit:total[0].total}
    ] 
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: {
            "_id.name":1, "_id.message":1
        }},
        ...limitPageStage,
        {$project: {
            _id: 0,
            name: "$_id.name",
            message: "$_id.message",
            stack: "$stacks",
            totalSessions: {$size: "$sessions"},
            totalErrors: 1,
            browserVersion: 1
          }
        }
    ]);    
    const stackFilter = (array:Array<string>) => {
        const arr:Array<string[]> = [];
        for (let item of array){
            arr.push(item.split('at'));
        }
        return _.intersection(...arr).join('at');
    }
    const aggregatedLogs = logs.map(log => ({...log, stack: stackFilter(log.stack)}));
    return {logs:aggregatedLogs, total:logs.length===0?0:total[0].total};
};

export const sessionView = async(queryObject:Partial<queryObjectInterface>, limit:number|null, page:number|null, timestampOptions:TimestampOptions) => {
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
    const limitPageStage:PipelineStage[] = [
        {$skip: page&&limit?(page-1)*(limit?limit:total[0].total):0},
        {$limit: limit?limit:total[0].total}
    ]  
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: {
            "date": -1, "_id.sessionId":-1
        }},
        ...limitPageStage,
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

export const atomicView = async(queryObject:Partial<queryObjectInterface>, limit:number|null, page:number|null, timestampOptions:TimestampOptions) => {
    const preCountStages = [{$match: queryObject}];
    const total = await Log.aggregate([...preCountStages, {$count:"total"}]);
    const limitPageStage:PipelineStage[] = [
        {$skip: page&&limit?(page-1)*(limit?limit:total[0].total):0},
        {$limit: limit?limit:total[0].total}
    ] 
    const logs = await Log.aggregate([
        ...preCountStages,
        {$sort: { timestamp:-1, sessionId: 1}},
        ...limitPageStage,
        {$project: {
            _id: 0,
            sessionId: 1,
            timestamp: {$dateToString: {
                date:"$timestamp",
                ...timestampOptions
            }},
            name:1,
            message:1,
            stack:1,
            browserVersion:1,
            actions: 1
        }}
    ]);
    return {logs, total:logs.length===0?0:total[0].total};
};