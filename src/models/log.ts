import { Schema, model } from 'mongoose';
import { ActionType } from 'intersection'; 

export interface ErrorLogInterface {
    appId: string,
    sessionId: string,
    message: string,
    name: string,
    stack: string,
    actions: ActionType[],
    browserVersion: string,
    timestamp: Date
}

const logSchema = new Schema<ErrorLogInterface>({
    appId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stack: {
        type: String,
        required: true
    },
    actions: [{
        type: Object,
        default: []
    }],
    browserVersion: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    }
});

const Log = model<ErrorLogInterface>('Log', logSchema);

export default Log;