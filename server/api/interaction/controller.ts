import { Request, Response } from 'express';
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
    const interactionsData = req.body.interactions;

    const createPromises = Object.keys(interactionsData).flatMap(key => {
      return interactionsData[key].map(async (interaction: any) => {
        if (interaction) {
          const { match, player, setNumber, teamPoints, rivalPoints, type, action, playerToSwap } = interaction;

          const newInteraction = new InteractionModel({
            match,
            player,
            setNumber,
            teamPoints,
            rivalPoints,
            type,
            action,
            playerToSwap,
          });
          console.log(newInteraction);
          await newInteraction.save();
        }
      });
    });

    await Promise.all(createPromises);

    res.status(200).json({ message: 'Interacciones creadas exitosamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
