import mongoose, { Document, Schema, Model } from 'mongoose';
import { IInteractionDocument, IInteractionModel } from './types';

const collectionName = 'interactions';

const interactionSchema = new Schema({
    match: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    setNumber: { type: Number, required: true },
    teamPoints: { type: Number, required: true },
    rivalPoints: { type: Number, required: true },
    type: { type: String, enum: ['good', 'bad', 'continuity', 'substitution', 'entrance'], required: true },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Interaction: IInteractionModel = mongoose.model<IInteractionDocument>(collectionName, interactionSchema);

export default Interaction;
