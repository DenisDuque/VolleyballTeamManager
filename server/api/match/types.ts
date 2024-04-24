import { Document, Model, Types } from 'mongoose';

export interface IMatchDocument extends Document {
    user: Types.ObjectId;
    name: string;
    rival: string;
    team: Types.ObjectId;
    players: { _id: Types.ObjectId, middleblocker: boolean }[];
    date: Date;
    type: number;
    result: { set: number, team: number, rival: number }[];
    status: string;
    lineups: { players: Types.ObjectId[], libero: { _id: Types.ObjectId, receiving: boolean }[] }[];
    finished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type IMatchModel = Model<IMatchDocument, any, any>