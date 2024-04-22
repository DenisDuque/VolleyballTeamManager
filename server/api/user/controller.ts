// user/controller.ts

import { Request, Response } from 'express';
import UserModel from './User'; // Importa el modelo de usuario

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};