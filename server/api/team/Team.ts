import mongoose, { Schema } from 'mongoose';
import { ITeamDocument, ITeamModel } from './types';

const collectionName = 'teams';

const teamSchema = new Schema<ITeamDocument, ITeamModel>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  category: { type: Number, required: true, enum: [0, 1, 2, 3] }, // 0 = Senior, 1 = Junior, etc.
  gender: { type: Number, required: true, enum: [0, 1, 2] }, // 0 = male, 1 = female, 2 = mixed
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'players' }],
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Team: ITeamModel = mongoose.model<ITeamDocument>(collectionName, teamSchema);

export default Team;
