import { Schema, model } from 'mongoose';
import { ErrorReportInterface } from '../sharedTypes/shared';

interface ErrorLogInterface extends ErrorReportInterface {
    appId: string,
    sessionId: string
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
        type: String
    }
});

const Log = model<ErrorLogInterface>('Log', logSchema);

export default Log;