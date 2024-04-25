// user/controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from './User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = await user.comparePassword(password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al verificar el usuario" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      surname,
      email,
      password: hashedPassword 
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};