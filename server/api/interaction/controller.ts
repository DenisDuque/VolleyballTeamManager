import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import InteractionModel from './Interaction';

export const getMatchInteractions = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId;

    const interactions = await InteractionModel.find({ match: matchId });
    res.json(interactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlayerInteractions = async (req: Request, res: Response) => {
  try {
    const playerId = req.params.playerId;

    const interactions = await InteractionModel.find({ player: playerId });
    res.json(interactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const saveInteractions = async (req: Request, res: Response) => {
  try {
    const interactionsData = req.body;

    const createPromises = interactionsData.map(async (interaction: any) => {
      const { matchId, playerId, setNumber, teamPoints, rivalPoints, type } = interaction;

      const newInteraction = new InteractionModel({
        match: matchId,
        player: playerId,
        setNumber,
        teamPoints,
        rivalPoints,
        type
      });

      await newInteraction.save();
    });

    await Promise.all(createPromises);

    res.status(201).json({ message: 'Interacciones creadas exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};