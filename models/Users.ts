import mongoose from "mongoose";

interface IUser extends Document {
    firstName: string, 
    lastName: string, 
    email: string;
    houseNumber: string;
    password: string; 
    isActive: boolean; 
    role: string; 
    authProviderId: string; 
    createdAt: Date
  }

const userSchema = new mongoose.Schema<IUser>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    houseNumber: {type: String, required: true}, 
    password: {type: String},
    isActive: {type: Boolean},
    role: {type: String, default: 'user'},
    authProviderId : {type: String}, 
    createdAt: { type: Date, default: new Date(new Date().getTime() + 1 * 60 * 60 * 1000)},
})

export const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema)