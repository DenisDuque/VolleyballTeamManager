import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { 
  getMatchInteractions, 
  getPlayerInteractions,
  saveInteractions
} from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el interaction!');
});

router.get(
  '/getMatchInteractions/:matchId', 
  getMatchInteractions,
);

router.get(
  '/getPlayerInteractions/:playerId', 
  getPlayerInteractions,
);

router.post(
  '/saveInteractions', 
  saveInteractions,
);

export default router;