import { Schema, model, ObjectId } from 'mongoose';

interface UserInterface {
    name: string,
    email: string,
    projects: ObjectId[],
    permissions: string[]
}

const userSchema = new Schema<UserInterface>({
    name:{
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
    }],
    permissions: [{
        type: String,
        default: ['read']
    }]
}) 

const User = model<UserInterface>('User', userSchema);

export default User;