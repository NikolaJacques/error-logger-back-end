import { Schema, model, Document } from 'mongoose';
import { EventType } from '../utils/changeStream';

export interface EventInterface extends Document {
    _doc: any,
    type: EventType
    endPointUrl: string
}

const eventSchema = new Schema<EventInterface>({
    type: {
        type: String,
        required: true
    },
    endPointUrl: {
        type: String,
        required: true
    }
});

const Event = model<EventInterface>('Event', eventSchema);

export default Event;