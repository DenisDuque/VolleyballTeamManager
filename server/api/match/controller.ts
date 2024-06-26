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
      select: 'name category gender captain'
    })
    .populate({
      path: 'players',
      select: 'name surname position dorsal'
    })
    .populate({
      path: 'lineups.players._id',
      select: 'name surname position dorsal'
    })
    .populate({
      path: 'lineups.libero._id',
      select: 'name surname position dorsal'
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

export const saveGame = async (req: Request, res: Response) => {
  try {
    const { matchId, result, status } = req.body;

    const match = await MatchModel.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }
    const formattedResult = result.map((setResult: any) => ({
      team: typeof setResult.teamPoints === 'object' ? setResult.teamPoints : setResult.teamPoints,
      rival: typeof setResult.rivalPoints === 'object' ? setResult.rivalPoints : setResult.rivalPoints,
    }));

    match.result = formattedResult;
    match.status = status;
    match.finished = true;

    await match.save();

    res.json({ message: 'Partido guardado correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};