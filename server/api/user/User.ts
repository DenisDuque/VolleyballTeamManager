import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
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

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as IUserDocument;

  try {
    const passwordMatch = await bcrypt.compare(candidatePassword, user.password);
    return passwordMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw new Error('Error al comparar contraseñas');
  }
};

const User: IUserModel = mongoose.model<IUserDocument>(collectionName, userSchema);

export default User;