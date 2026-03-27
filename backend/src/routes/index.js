import express from 'express';
import { MESSAGES } from '../utils/constants.js';
const router = express.Router();

import profileRoutes from './profileRoutes.js';
import eventRoutes from './eventRoutes.js';

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: MESSAGES.SYSTEM.HEALTH,
        timestamp: new Date().toISOString()
    });
});

// Profile routes
router.use('/profiles', profileRoutes);

// Event routes
router.use('/events', eventRoutes);

export default router;
