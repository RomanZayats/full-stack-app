import { Router } from 'express';

import { authLimiter } from '../config/rateLimit';
import { register, login, logout, refreshToken, logoutAll } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), register);
router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/logout-all', auth, logoutAll);

export default router;
