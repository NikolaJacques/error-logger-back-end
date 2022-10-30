import { Schema, model, ObjectId, Types } from 'mongoose';

interface UserInterface {
    name: string,
    email: string,
    projects: ObjectId[]
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
    }]
}) 

const User = model<UserInterface>('User', userSchema);

export default User;