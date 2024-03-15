import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

interface UserInterface extends Document {
    first_name: string;
    second_name: string;
    email: string;
    dob: Date;
    city: string;
    country: string;
    address: string;
    phone_number: string;
    password: string;
    status: string;
    //resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    deleted: boolean;
}

const userSchema: Schema<UserInterface> = new Schema({
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    //resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    deleted:{type:Boolean,default:false},
});

userSchema.plugin(mongoosePaginate); 
const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
