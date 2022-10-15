import { RequestHandler } from 'express';
import Log from '../models/log';

export const getLogs: RequestHandler = async (req, res, next) => {
    try{
        const logs = await Log.find({});
        if(logs.length===0){
            res.status(404).json({
                message: 'No logs found.'
            });
        }
        res.status(200).json({
            message: 'Logs retrieved successfully',
            logs
        });
    }
    catch(err){
        next(err);
    }
};

export const postLog: RequestHandler = (_, _2, _3) => {

};

export const deleteLogs: RequestHandler = (_, _2, _3) => {};
export const archiveLogs: RequestHandler = (_, _2, _3) => {};