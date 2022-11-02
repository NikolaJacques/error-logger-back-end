import {Router} from 'express';
import * as logController from '../controllers/log';
import { appAuth } from '../middleware/appAuth';
import { adminAuth } from '../middleware/adminAuth';
import { permissions } from '../middleware/permissions';

const router = Router();

router.post('/', appAuth, logController.postLog);

router.get('/:id', adminAuth, permissions, logController.getLogs);

export default router;