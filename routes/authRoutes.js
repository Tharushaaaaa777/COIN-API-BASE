const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser } = require('../controllers/authController');

// Standard Auth Routes
router.post('/register', registerUser);
router.post('/login', authUser);

// 💡 Google Auth Success Route (EJS View එක පෙන්වයි)
router.get('/google/success', (req, res) => {
    // පරිශීලකයා ලොග් වී ඇත්දැයි පරීක්ෂා කිරීම
    if (req.isAuthenticated() && req.user) {
        // googleAuthSuccess.ejs ගොනුව Render කිරීම
        res.render('googleAuthSuccess', {
            user: req.user 
        });
    } else {
        // ලොග් වී නොමැති නම්, Login පිටුවට Redirect කිරීම
        res.redirect('/login');
    }
});

// Google Authentication (Routes are now in server.js)
// Google Auth Success Handler (used for JSON API response, but not for this EJS view)
// router.get('/google/success', googleAuthSuccess); 

module.exports = router;
