import {Router} from 'express';
import * as authController from '../controllers/auth';
// import * as logController from '../controllers/log';

const router = Router();

router.post('/auth', authController.authenticate);

router.post('/');

router.get('/');

export default router;