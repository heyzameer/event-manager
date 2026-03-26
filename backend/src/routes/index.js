const express = require('express');
const router = express.Router();

const profileRoutes = require('./profileRoutes');
const eventRoutes = require('./eventRoutes');

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Event Management System API is running',
        timestamp: new Date().toISOString()
    });
});

router.use('/profiles', profileRoutes);
router.use('/events', eventRoutes);

module.exports = router;
