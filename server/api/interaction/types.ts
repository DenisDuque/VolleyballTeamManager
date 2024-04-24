import { Document, Model, Types } from 'mongoose';

export interface IInteractionDocument extends Document {
    match: Types.ObjectId;
    player: Types.ObjectId;
    setNumber: number;
    teamPoints: number;
    rivalPoints: number;
    type: 'good' | 'bad' | 'continuity' | 'substitution' | 'entrance';
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type IInteractionModel = Model<IInteractionDocument, any, any>;
