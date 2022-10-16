import { Schema, model, ObjectId } from 'mongoose';

interface ProjectInterface {
    name: string,
    secret: string,
    description: string,
    user: ObjectId,
    createdAt: Date,
    active: boolean
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    }
})

const Project = model<ProjectInterface>('Project', projectSchema);

export default Project;