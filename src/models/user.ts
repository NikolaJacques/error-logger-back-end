import { Schema, model, ObjectId } from 'mongoose';
import {Role} from '../utils/sharedTypes';

export interface UserInterface {
    name: string,
    password: string,
    email: string,
    role: Role,
    projects: ObjectId[]
}

const userSchema = new Schema<UserInterface>({
    name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        default: []
    }]
}) 

const User = model<UserInterface>('User', userSchema);

export default User;