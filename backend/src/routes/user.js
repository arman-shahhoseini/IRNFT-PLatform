import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { getMe, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);
router.patch('/update-profile', updateProfile);

export default router; 