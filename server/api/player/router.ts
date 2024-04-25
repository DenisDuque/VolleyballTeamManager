import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { 
  createPlayer, 
  updatePlayer,
  deletePlayer
} from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el player!');
});

router.post(
  '/createPlayer', 
  createPlayer,
);

router.post(
  '/updatePlayer', 
  updatePlayer,
);

router.delete(
  '/deletePlayer/:playerId', 
  deletePlayer,
);

export default router;