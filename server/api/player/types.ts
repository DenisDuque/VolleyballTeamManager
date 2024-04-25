import { Document, Schema, Model, Types } from 'mongoose';

export interface IPlayerDocument extends Document {
  user: Types.ObjectId;
  name: string;
  surname: string;
  position: string;
  category: 0 | 1 | 2 | 3; // 0 = Senior, 1 = Junior, etc.
  gender: boolean; // true = female, false = male
  birthDate: Date;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IPlayerModel = Model<IPlayerDocument>;
