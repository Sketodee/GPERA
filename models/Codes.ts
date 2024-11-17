import mongoose, { Model } from "mongoose";

export interface ICode extends Document {
    createdBy: string; 
    visitorName: string; 
    code: string; 
    status: string; 
    creatorId: string; 
    createdAt: Date; 
    activationTime: Date; 
}

const CodeSchema = new mongoose.Schema<ICode>({
    createdBy: {type: String, required: true}, 
    visitorName: {type: String, required: true}, 
    code: {type: String, required: true}, 
    status : {type: String, required: true}, 
    creatorId : {type: String, required: true}, 
    createdAt: { type: Date, default: new Date(new Date().getTime() + 1 * 60 * 60 * 1000) },
    activationTime: {type: Date}
})


export const Code: Model<ICode> = mongoose.models?.Code || mongoose.model<ICode>("Code", CodeSchema)