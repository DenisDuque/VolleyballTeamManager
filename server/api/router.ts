import { Router, Request, Response } from 'express';
import userRouter from './user/router';
import matchRouter from './match/router';
import interactionRouter from './interaction/router';
import teamRouter from './team/router';
import playerRouter from './player/router';

const router = Router();

router.get('/saludo', (req: Request, res: Response) => {
  res.send('¡Hola desde el router!');
});

router.use('/users', userRouter);
router.use('/matches', matchRouter);
router.use('/interactions', interactionRouter);
router.use('/teams', teamRouter);
router.use('/players', playerRouter);

export default router;
