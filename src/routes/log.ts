import {Router} from 'express';
import * as authController from '../controllers/auth';
import * as logController from '../controllers/log';
import {auth as appAuth} from '../middleware/appAuth';
import {auth as adminAuth} from '../middleware/adminAuth';
import { permissions } from '../middleware/permissions';

const router = Router();

router.post('/auth', authController.authenticate);

router.post('/', appAuth, logController.postLog);

router.get('/:id', adminAuth, permissions, logController.getLogs);

export default router;