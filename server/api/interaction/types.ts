import { Document, Model, Types } from 'mongoose';

export interface IInteractionDocument extends Document {
    match: Types.ObjectId;
    player: Types.ObjectId;
    setNumber: number;
    teamPoints: number;
    rivalPoints: number;
    type: string;
    action: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type IInteractionModel = Model<IInteractionDocument, any, any>;
