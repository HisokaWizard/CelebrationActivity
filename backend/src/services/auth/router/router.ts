import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../../../exeptions/auth-middleware.js';
import { emploeeController } from '../controllers/employee-controller.js';

export const router = new (Router as any)();
router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  emploeeController.registration,
);
router.post('/login', emploeeController.login);
router.post('/logout', emploeeController.logout);
router.get('/activate/:link', emploeeController.activate);
router.get('/refresh', emploeeController.refresh);
router.get('/users', authMiddleware, emploeeController.getUsers);
