import { Schema, model, ObjectId } from 'mongoose';

export interface UserInterface {
    name: string,
    password: string,
    email: string,
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
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        default: []
    }]
}) 

const User = model<UserInterface>('User', userSchema);

export default User;