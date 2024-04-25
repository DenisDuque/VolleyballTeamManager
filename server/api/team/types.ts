import { Document, Model, Types } from 'mongoose';

export interface ITeamDocument extends Document {
  user: Types.ObjectId;
  name: string;
  category: 0 | 1 | 2 | 3; // 0 = Senior, 1 = Junior, etc.
  gender: boolean; // true = female, false = male
  players: Types.ObjectId[];
  captain: Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ITeamModel = Model<ITeamDocument>;
