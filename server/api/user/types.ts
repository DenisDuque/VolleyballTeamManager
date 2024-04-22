import { Document, Schema, Model, Types } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  teams: Types.ObjectId[];
  players: Types.ObjectId[];
  matches: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSchema {
  name: { type: string; required: boolean };
  surname: { type: string; required: boolean };
  email: { type: string; required: boolean; unique: boolean };
  password: { type: string; required: boolean };
  teams: { type: Types.ObjectId[]; ref: string };
  players: { type: Types.ObjectId[]; ref: string };
  matches: { type: Types.ObjectId[]; ref: string };
  createdAt: { type: Date; default: Date };
  updatedAt: { type: Date; default: Date };
}

export type IUserModel = Model<IUserDocument, any, any>