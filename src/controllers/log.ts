import { FilterQuery } from 'mongoose';
import { RequestHandler } from 'express';
import Log from '../models/log';
import { ErrorLogInterface } from '../models/log';
import { errorView, atomicView, sessionView, queryObjectInterface } from '../utils/queries';
import { ViewType } from '../utils/sharedTypes';

export const getLogs: RequestHandler = async (req, res, next) => {
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

        let logs;
        switch(view){
            case 'atomic' as ViewType:
                logs = await atomicView(parseInt(limit as string), parseInt(page as string));
            case 'session' as ViewType:
                logs = await sessionView(queryObject as Partial<queryObjectInterface>, parseInt(limit as string), parseInt(page as string));
            case 'error' as ViewType:
                logs = await errorView(queryObject as Partial<queryObjectInterface>, parseInt(limit as string), parseInt(page as string));
            default:
                logs = await Log.find(queryObject).sort({sessionId:-1,timeStamp:1});
        };
        if(logs.length===0){
            return res.status(404).json({
                message: 'No errors found.'
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

export const postLog: RequestHandler = async (req, res, next) => {
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