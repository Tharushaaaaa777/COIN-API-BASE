// routes/authRoutes.js (අවසාන කොටස යාවත්කාලීන කර ඇත)

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser } = require('../controllers/authController');
const { authorizeOwner } = require('../middleware/ownerMiddleware');
const { protect } = require('../middleware/authMiddleware'); 

// Standard Auth Routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Google Auth Success Route
router.get('/google/success', (req, res) => {
    if (req.isAuthenticated() && req.user) {
        res.render('googleAuthSuccess', {
            user: req.user 
        });
    } else {
        res.redirect('/login');
    }
});

// 💡 ADMIN PANEL FRONTEND ROUTE
// 1. protect: පරිශීලකයා ලොග් වී ඇත්දැයි පරීක්ෂා කරයි
// 2. authorizeOwner: ලොග් වී ඇත්තේ Owner දැයි පරීක්ෂා කරයි
router.get('/admin/send', protect, authorizeOwner, (req, res) => {
    // Owner successfully passed both checks
    res.render('adminPanel', { user: req.user });
});


module.exports = router;
