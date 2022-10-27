import {Router} from 'express';
import * as authController from '../controllers/auth';
import * as logController from '../controllers/log';
import {auth} from '../middleware/appAuth';

const router = Router();

router.post('/auth', authController.authenticate);

router.post('/', auth, logController.postLog);

router.get('/');

export default router;