import { FilterQuery } from 'mongoose';
import { NextFunction, RequestHandler } from 'express';
import Log from '../models/log';
import { ErrorLogInterface } from '../models/log';
import { errorView, atomicView, sessionView, queryObjectInterface } from '../utils/queries';
import { TypedRequest, TypedResponse, ViewType, RequestBodyInterface, QueryInterface, TimestampOptions } from '../utils/sharedTypes';
import Project from '../models/project';

export const getLogs = async (req:TypedRequest<any,Partial<QueryInterface>>, res:TypedResponse<{message: string, logs?: any[]}>, next:NextFunction) => {
    try{
        const {startDate, endDate, sessionId, name, page, limit, view} = req.query;
        let queryObject:FilterQuery<typeof Log>={_id: req.params.id};
        if(startDate && endDate){
            queryObject = {...queryObject,
                timeStamp: {
                            $gte: new Date(startDate as string), 
                            $lte: new Date(endDate as string)
                        }
            };
        };
        if(sessionId){
            queryObject = {...queryObject, sessionId};
        };
        if(name){
            queryObject = {...queryObject, name};
        };
        const project = await Project.findById(req.params.id);
        const timestampOptions:TimestampOptions = project!.timestampOptions;
        let logs;
        switch(view){
            case 'atomic' as ViewType:
                logs = await atomicView({}, parseInt(limit as string), parseInt(page as string), timestampOptions);
            case 'session' as ViewType:
                logs = await sessionView(queryObject as Partial<queryObjectInterface>, parseInt(limit as string), parseInt(page as string), timestampOptions);
            case 'error' as ViewType:
                logs = await errorView(queryObject as Partial<queryObjectInterface>, parseInt(limit as string), parseInt(page as string), timestampOptions);
            default:
                logs = await atomicView({}, parseInt(limit as string), parseInt(page as string), timestampOptions);
        };
        if(logs.length===0){
            return res.status(404).json({
                message: 'No logs found.'
            });
        };
        res.status(200).json({
            message: 'Logs retrieved successfully',
            logs
        });
    }
    catch(err){
        next(err);
    }
};

export const postLog = async (req:TypedRequest<RequestBodyInterface,any>, res:TypedResponse<{message:string,log:ErrorLogInterface}>, next: NextFunction) => {
    try {
        const logObj:ErrorLogInterface = {...req.body, timestamp: new Date(req.body.timestamp)}
        const log = new Log(logObj);
        await log.save();
        res.status(200).json({
            message: 'Log successfully saved.',
            log
        });
    }
    catch(err){
        next(err);
    }
};

export const deleteLogs: RequestHandler = (_, _2, _3) => {};