import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 15,
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

import { register, login, updateUser, getCurrentUser, logout } from '../controllers/authController.js';
import authenticatedUser from '../middleware/auth.js';
import testUser from '../middleware/testUser.js';

// everyone will have access to register or login
router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
router.get('/logout', logout);
// but only authenticates user can update
router.route('/updateUser').patch(authenticatedUser, testUser, updateUser);
router.route('/getCurrentUser').get(authenticatedUser, getCurrentUser);

export default router;
