import mongoose, { Schema } from 'mongoose';
import { IInteractionDocument, IInteractionModel } from './types';

const collectionName = 'interactions';

const interactionSchema = new Schema({
    match: { type: Schema.Types.ObjectId, ref: 'matches', required: true },
    player: { type: Schema.Types.ObjectId, ref: 'players', required: true },
    setNumber: { type: Number, required: true },
    teamPoints: { type: Number, required: true },
    rivalPoints: { type: Number, required: true },
    type: { type: String, enum: ['good', 'bad', 'continuity', 'substitution', 'entrance'], required: true },
    action: { type: String, enum: ['block', 'spike', 'set', 'receive', null], required: true },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Interaction: IInteractionModel = mongoose.model<IInteractionDocument>(collectionName, interactionSchema);

export default Interaction;
