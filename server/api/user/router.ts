import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { getAllUsers } from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el user!');
});

router.get(
  '/getAllUsers', 
  sendJsonResponse('users')
);

export default router;