import { Schema, model } from 'mongoose';

interface ProjectInterface {
    name: string,
    secret: string,
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
    secret: {
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

const Projects = model<ProjectInterface>('Project', projectSchema);

export default Projects;