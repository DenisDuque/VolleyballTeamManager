import mongoose, { Document, Schema, Model } from 'mongoose';
import { IMatchDocument, IMatchModel } from './types';

const collectionName = 'matches';

const matchSchema = new Schema<IMatchDocument, IMatchModel>({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    rival: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'players', required: true }],
    date: { type: Date, required: true },
    type: { type: Number, enum: [0, 1], required: true }, // 0 = Bo3, 1 = Bo5
    result: [{
        team: { type: Number },
        rival: { type: Number }
    }],
    status: { type: Number, required: true, enum: [0, 1, 2] }, // 0 = Pending, 1 = Won, 2 = Lost
    lineups: [{
        set: { type: Number, required: true},
        rotation: { type: Number, required: true, default: 1,},
        players: [{
            _id: { type: Schema.Types.ObjectId, ref: 'players', required: true },
            isCaptain: { type: Boolean, default: false }
        }],
        libero: [{
            _id: { type: Schema.Types.ObjectId, ref: 'players', required: true },
            receiving: { type: Boolean, default: true }
        }]
    }],
    finished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Match: IMatchModel = mongoose.model<IMatchDocument>(collectionName, matchSchema);

export default Match;