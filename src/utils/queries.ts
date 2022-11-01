import Log from '../models/log';

export interface queryObjectInterface {
    startDate: Date, 
    endDate: Date, 
    sessionId: string, 
    name: string
}

export const errorView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number) => {
    return await Log.aggregate([
        {$match: queryObject},
        {$group: {
            _id: {name: "$name", message: "$message", stackTrace: "$stackTrace"},
            totalErrors: {$count: "$name"},
            totalSessions: {$count: "$sessionId"},
            browserVersions: {
                $addToSet: {
                    browserVersion: "$browserVersion"
                }
            }
        }},
        {$sort: {
            "_id.name":1, "_id.message":1
        }},
        {$skip: (page-1)*limit},
        {$limit: limit}
    ]);
};

export const sessionView = async(queryObject:Partial<queryObjectInterface>, limit:number, page:number) => {
    return await Log.aggregate([
        {$match: queryObject},
        {$group: {
            _id: {sesionId: "$sessionId"},
            date: {$min: "$timestamp"},
            totalErrors: {$count: "$name"},
            errors: {
                $addToSet: {
                    stackTrace: "$stackTrace"
                }
            }
        }},
        {$sort: {
            "date": -1, "_id.sessionId":-1
        }},
        {$skip: (page-1)*limit},
        {$limit: limit}
    ]);
};

export const atomicView = async(limit:number, page:number) => {
    return await Log.aggregate([
        {$match: {}},
        {$sort: { sessionId: 1, timeStamp:-1}},
        {$skip: (page-1)*limit},
        {$limit: limit}
    ]);
};