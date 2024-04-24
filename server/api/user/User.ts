import mongoose, { Schema } from 'mongoose';
import { IUserDocument, IUserModel } from './types';

const collectionName = 'users';

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

const User: IUserModel = mongoose.model<IUserDocument>(collectionName, userSchema);

export default User;