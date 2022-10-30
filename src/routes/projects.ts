import {Router} from 'express';
import {auth} from '../middleware/adminAuth';
import {permissions} from '../middleware/permissions';
import * as projectController from '../controllers/projects';

const router = Router();

router.get('/:id', auth, permissions, projectController.getProject);

export default router;