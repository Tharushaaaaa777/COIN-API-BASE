const express = require('express');
const router = express.Router();
const { getTiktokVideo, getApiKey } = require('../controllers/apiController');
const { protect } = require('../middleware/authMiddleware'); 

// 1. /api/key - Get the user's API Key and Coins 
router.get('/key', protect, getApiKey);

// 💡 2. /api/tiktok - TikTok Video Scraper Endpoint (GET Method)
router.get('/tiktok', protect, getTiktokVideo); 

module.exports = router;
