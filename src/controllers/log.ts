import { FilterQuery } from 'mongoose';
import { NextFunction, RequestHandler } from 'express';
import Log from '../models/log';
import { ErrorLogInterface } from '../models/log';
import { errorView, atomicView, sessionView, queryObjectInterface } from '../utils/queries';
import { TimestampOptions } from 'intersection';
import { QueryInterface, ViewType } from 'frontend-backend';
import { ExtendedErrorLogType } from 'intersection';
import { TypedRequest, TypedResponse } from 'delivery-backend';
import Project from '../models/project';
import { DateTime } from 'luxon';
import { dateValidator } from '../utils/dateValidator';

type ResponseType = {message: string, logs: any[], total:number} | {message: string};

export const getLogs = async (req: TypedRequest<any,Partial<QueryInterface>>, res:TypedResponse<ResponseType>, next:NextFunction) => {
    try{
        const {startDate, endDate, sessionId, name, page, limit, view} = req.query;
        let queryObject:FilterQuery<typeof Log>={appId: req.params.id};
        const project = await Project.findById(req.params.id);
        const timestampOptions:TimestampOptions = project!.timestampOptions;
        let timestamp = {};
        if(startDate){
            const date = dateValidator(startDate); 
            if (date){
                timestamp = {...timestamp, $gte: new Date(startDate as string)};
            }
        }
        if(endDate){
            const date = dateValidator(endDate);
            if (date){
                if (startDate){
                    if (endDate > startDate){
                        timestamp = {...timestamp, $lte: new Date(endDate as string)};
                    }
                } else {
                    timestamp = {...timestamp, $lte: new Date(endDate as string)};
                }
            }
        }
        if(startDate || endDate){
            queryObject = {...queryObject,
                timestamp
            };
        };
        if(sessionId){
            queryObject = {...queryObject, sessionId};
        };
        if(name){
            queryObject = {...queryObject, name};
        };
        let limitParam = Number.isInteger(parseInt(limit as string))?parseInt(limit as string):10;
        let pageParam = Number.isInteger(parseInt(page as string))?parseInt(page as string):1;
        let data;
        switch(view as ViewType){
            case 'atomic':
                data = await atomicView(queryObject as Partial<queryObjectInterface>, limitParam, pageParam, timestampOptions);
                break;
            case 'session':
                data = await sessionView(queryObject as Partial<queryObjectInterface>, limitParam, pageParam, timestampOptions);
                break;
            case 'error':
                data = await errorView(queryObject as Partial<queryObjectInterface>, limitParam, pageParam, timestampOptions);
                break;
            default:
                data = await atomicView(queryObject as Partial<queryObjectInterface>, limitParam, pageParam, timestampOptions);
        };
        if(data.total===0){
            return res.status(404).json({
                message: 'No logs found.'
            });
        };
        res.status(200).json({
            message: 'Logs retrieved successfully',
            total: data.total,
            logs: data.logs
        });
    }
    catch(err){
        next(err);
    }
};

export const postLog = async (req:TypedRequest<ExtendedErrorLogType<number>,any>, res:TypedResponse<{message:string,log:ErrorLogInterface}>, next: NextFunction) => {
    try {
        let logObj:ErrorLogInterface
        const date = DateTime.fromMillis(req.body.timestamp);
        logObj = {...req.body, timestamp: date.isValid?new Date(req.body.timestamp):new Date()};
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