import { Router, Request, Response } from 'express';
import userRouter from './user/router';
import matchRouter from './match/router';
import interactionRouter from './interaction/router';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el router!');
});

router.use('/users', userRouter);
router.use('/matches', matchRouter);
router.use('/interactions', interactionRouter);

export default router;
