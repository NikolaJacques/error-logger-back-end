import { Schema, model } from 'mongoose';

interface ProjectInterface {
    name: string,
    description: string,
    email: string,
    createdAt: Date,
    active: boolean
}

const projectSchema = new Schema<ProjectInterface>({
    name: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
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