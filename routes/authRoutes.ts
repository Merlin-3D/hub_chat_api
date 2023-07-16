import { Router } from 'express';
import { login, signup } from '../controller/authController';

const authRouter = Router();

authRouter.post('/auth/signup', signup);
authRouter.post('/auth/login', login);

export default authRouter;
