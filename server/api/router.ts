import { Router, Request, Response } from 'express';
import userRouter from './user/router';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el router!');
});

router.use('/user', userRouter);

export default router;
