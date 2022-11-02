import {Router} from 'express';
import {adminAuth} from '../middleware/adminAuth';
import {permissions} from '../middleware/permissions';
import * as projectController from '../controllers/projects';

const router = Router();

router.get('/:id', adminAuth, permissions, projectController.getProject);

export default router;