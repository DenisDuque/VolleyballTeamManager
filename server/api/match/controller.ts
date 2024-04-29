import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import MatchModel from './Match';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const matches = await MatchModel.find({ user: userId });
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId;

    const match = await MatchModel.findById(matchId)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'team',
      select: 'name category'
    })
    .populate({
      path: 'players',
      select: 'name surname position'
    })
    .populate({
      path: 'lineups.players._id',
      select: 'name' 
    })
    .populate({
      path: 'lineups.libero._id',
      select: 'name'
    });
      
    res.json(match);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLineups = async (req: Request, res: Response) => {
  try {
    const { matchId, lineups } = req.body;

    const match = await MatchModel.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    match.lineups = lineups;

    await match.save();

    res.json({ message: 'Lineups actualizados correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};