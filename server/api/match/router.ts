import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { getMatches, updateLineups, getMatch, saveGame } from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el match!');
});

router.get(
  '/getMatch/:matchId', 
  getMatch,
);

router.get(
  '/getMatches/:userId', 
  getMatches,
);

router.post(
  '/updateLineups', 
  updateLineups,
);

router.post(
  '/saveGame', 
  saveGame,
);

export default router;