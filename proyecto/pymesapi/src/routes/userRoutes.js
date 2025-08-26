// src/routes/userRoutes.js
import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

// Auth
router.post('/register', userController.register); // POST /api/auth/register
router.post('/login',    userController.login);    // POST /api/auth/login
router.get('/verify',    userController.verify);   // GET  /api/auth/verify (Authorization: Bearer <token>)

export default router;
