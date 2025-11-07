const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser, googleAuthSuccess } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: true 
    }),
    googleAuthSuccess
);

module.exports = router;
