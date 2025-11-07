const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTiktokVideo, getApiKey } = require('../controllers/apiController');
const { addCoins } = require('../controllers/adminController'); 

// API Key ලබා ගැනීමට (GET /api/key)
router.get('/key', protect, getApiKey);

// Scraper API Route (GET /api/tiktok) - Coin 5ක් කපා හැරේ
router.get('/tiktok', protect, getTiktokVideo); 

// ADMIN ROUTE: Coin එකතු කිරීමට
// POST /api/admin/add-coins (Owner ගේ API Key එක අවශ්‍යයි)
router.post('/admin/add-coins', protect, addCoins); 

module.exports = router;
