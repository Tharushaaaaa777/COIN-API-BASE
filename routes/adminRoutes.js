// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { sendCoins } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware'); 
const { authorizeOwner } = require('../middleware/ownerMiddleware'); 

// Coins යැවීමේ API Endpoint එක
router.post('/sendcoins', protect, authorizeOwner, sendCoins);

module.exports = router;
