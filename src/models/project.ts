import { Schema, model, ObjectId, PopulatedDoc, Document, Types } from 'mongoose';
import { TimestampOptions } from 'intersection';
import Event from './event';

export interface ProjectInterface extends Document {
    _doc: any,
    name: string,
    secret: string,
    description: string,
    user: ObjectId,
    timestampOptions: TimestampOptions,
    createdAt: Date,
    active: boolean,
    events: PopulatedDoc<Document<ObjectId> & Event>[]
}

const projectSchema = new Schema<ProjectInterface>({
    name: {
        type:String,
        required: true
    },
    secret: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    timestampOptions: {
        type: Object,
        required: false,
        default: {
            format:"%d-%m-%Y",
            timezone:"Europe/Brussels"
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: Event
    }]
})

const Project = model<ProjectInterface>('Project', projectSchema);

export default Project;