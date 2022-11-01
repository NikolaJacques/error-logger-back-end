import { Schema, model } from 'mongoose';

export interface ErrorLogInterface {
    appId: string,
    sessionId: string,
    message: string,
    name: string,
    stackTrace: string,
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
    stackTrace: {
        type: String,
        required: true
    },
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