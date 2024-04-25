import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { 
  createTeam,
  updateTeam,
  getTeamsFromUser
} from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el team!');
});


router.post(
  '/createTeam', 
  createTeam,
);

router.post(
  '/updateTeam', 
  updateTeam,
);

router.get(
  '/getTeamsFromUser/:userId', 
  getTeamsFromUser,
);


export default router;