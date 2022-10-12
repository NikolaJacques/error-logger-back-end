import {Router} from 'express';
import * as logsController from '../controllers/auth';

const router = Router();

// will require auth as admin
// will use query parameters to narrow request
// will use pagination
router.post('/admin');

router.post('/auth', logsController.authenticate);

router.post('/logs');

export default router;