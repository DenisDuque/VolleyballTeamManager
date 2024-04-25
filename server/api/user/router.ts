import { Router, Request, Response } from 'express';
import { sendJsonResponse } from '../../helpers/util/express';
import { getAllUsers, verifyUser, createUser } from './controller';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el user!');
});

router.get(
  '/getAllUsers', 
  getAllUsers,
);

router.post(
  '/verifyUser', 
  verifyUser,
);

router.post(
  '/createUser', 
  createUser,
);

export default router;