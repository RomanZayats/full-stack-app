import { Router } from 'express';

// import { auth } from '../middleware/auth.middleware';

import authRoute from './auth.route';
import homeRoute from './home.route';

const router = Router();

// public
router.use('/auth', authRoute);

// protected
// router.use(auth);
router.use('/home', homeRoute);

export default router;
