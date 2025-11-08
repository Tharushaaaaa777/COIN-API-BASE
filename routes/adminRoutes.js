// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { sendCoins } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware'); // ඔබගේ දැනට පවතින auth Middleware
const { authorizeOwner } = require('../middleware/ownerMiddleware'); // අලුත් Owner Middleware

// 💡 Coins යැවීමේ Endpoint එක: /api/admin/sendcoins
// ආරක්ෂක ස්ථර 3ක් ඇත: API Key (protect), Owner අවසරය (authorizeOwner)
router.post('/sendcoins', protect, authorizeOwner, sendCoins);

module.exports = router;
