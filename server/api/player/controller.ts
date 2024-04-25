import { Request, Response } from 'express';
import PlayerModel from './Player';

export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { user, name, surname, position, category, gender, teams, matches, birthDate } = req.body;

    const newPlayer = new PlayerModel({
      user,
      name,
      surname,
      position,
      category,
      gender,
      teams,
      matches,
      birthDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newPlayer.save();

    res.status(201).json(newPlayer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = req.params.playerId;
    const updates = req.body;

    updates.updatedAt = new Date();

    const updatedPlayer = await PlayerModel.findByIdAndUpdate(playerId, updates, { new: true });
    if (!updatedPlayer) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json(updatedPlayer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = req.params.playerId;

    const update = { isDeleted: true, updatedAt: new Date() };

    const deletedPlayer = await PlayerModel.findByIdAndUpdate(playerId, update, { new: true });
    if (!deletedPlayer) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.json({ message: "Jugador eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
