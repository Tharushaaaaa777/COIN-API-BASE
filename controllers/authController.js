const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const generateApiKey = () => uuidv4();
const INITIAL_COINS = 50; 

// 1. Register User (Email & Password)
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    // ... (input validation)

    try {
        const userExists = await User.findOne({ email });
        // ... (user check)

        const user = await User.create({
            email,
            password,
            apiKey: generateApiKey(), 
            coins: INITIAL_COINS, // 💡 Coin 50ක් ලබා දීම
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                email: user.email,
                apiKey: user.apiKey,
                coins: user.coins,
                message: `Registration successful! Your API Key generated with ${INITIAL_COINS} coins.`
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        // ... (error handling)
    }
};

// 2. Login User (Email & Password)
const authUser = async (req, res) => {
    const { email, password } = req.body;
    // ... (input validation)

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                email: user.email,
                apiKey: user.apiKey,
                coins: user.coins, // 💡 Coin ප්‍රමාණය response එකට එකතු කිරීම
                message: 'Login successful! Use this API Key to access protected routes.'
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        // ... (error handling)
    }
};

// 3. Google Login/Sign Up - Success Handler
const googleAuthSuccess = async (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Google login successful! Save your API Key.",
            email: req.user.email,
            apiKey: req.user.apiKey,
            coins: req.user.coins, // 💡 Coin ප්‍රමාණය response එකට එකතු කිරීම
        });
    } else {
        res.status(401).json({ success: false, message: "Google authentication failed." });
    }
};

module.exports = { 
    registerUser, 
    authUser,
    googleAuthSuccess
};
