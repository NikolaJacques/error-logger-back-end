import { ObjectId, Schema, model, Types } from 'mongoose';

export interface WebhookLog {
    eventId: ObjectId,
    status: Number,
    payload: Object,
    timestamp: Date
}

const webhookLogSchema = new Schema<WebhookLog>({
    eventId: {
        type: Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    payload: {
        type: Object,
        required: true,
        default: {}
    },
    timestamp: {
        type: Date,
        required: true,
        default: new Date()
    }
});

const WebhookLog = model<WebhookLog>('WebhookLog', webhookLogSchema);

export default WebhookLog;