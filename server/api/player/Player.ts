import mongoose, { Schema } from 'mongoose';
import { IPlayerDocument, IPlayerModel } from './types';

const collectionName = 'players';

const playerSchema = new Schema<IPlayerDocument, IPlayerModel>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  position: { type: String, required: true },
  category: { type: Number, required: true, enum: [0, 1, 2, 3] }, // 0 = Senior, 1 = Junior, etc.
  gender: { type: Boolean, required: true }, // true = female, false = male
  deleted: { type: Boolean, default: false },
  birthDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Player: IPlayerModel = mongoose.model<IPlayerDocument>(collectionName, playerSchema);

export default Player;
