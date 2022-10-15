import {Router} from 'express';
import * as authController from '../controllers/auth';

const router = Router();

// will require auth as admin
// will use query parameters to narrow request
// will use pagination
router.post('/auth', authController.login);

router.get('/', )