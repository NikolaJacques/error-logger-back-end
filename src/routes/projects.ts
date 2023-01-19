import {Router} from 'express';
import {adminAuth} from '../middleware/adminAuth';
import {permissions} from '../middleware/permissions';
import * as projectController from '../controllers/projects';

const router = Router();

router.get('/:id', adminAuth, permissions, projectController.getProject);

router.post('/:id', adminAuth, permissions, projectController.createOrUpdateProject);

router.delete('/:id', adminAuth, permissions, projectController.deleteProject);

router.get('/', adminAuth, projectController.getProjects);

export default router;