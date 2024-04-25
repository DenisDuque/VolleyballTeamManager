import { Request, Response } from 'express';
import TeamModel from './Team';

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { user, name, category, gender, players, matches, captain } = req.body;

    const newTeam = new TeamModel({
      user,
      name,
      category,
      gender,
      players,
      matches,
      captain
    });

    await newTeam.save();

    res.status(201).json(newTeam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;
    const updates = req.body;

    const updatedTeam = await TeamModel.findByIdAndUpdate(teamId, updates, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.json(updatedTeam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamsFromUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const teams = await TeamModel.find({ user: userId });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
