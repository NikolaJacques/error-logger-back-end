import {Router} from 'express';
import * as authController from '../controllers/auth';

const router = Router();

router.post('/user', authController.login);

router.post('/app', authController.authenticate);

export default router;