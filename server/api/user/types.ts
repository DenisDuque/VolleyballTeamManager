import { Document, Schema, Model, Types } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserModel = Model<IUserDocument, any, any>