const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const generateApiKey = () => uuidv4();
const INITIAL_COINS = 50; 
const REFERRAL_REWARD_REFEREE = 25; 
const REFERRAL_REWARD_REFERRER = 50; 

// 1. Register User (Email & Password)
const registerUser = async (req, res) => {
    const { email, password, referralCode, deviceId } = req.body; 
    const registrationIp = req.clientIp; // 💡 request-ip middleware මගින් IP එක ලබා ගනී

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    try {
        // 💡 1. Device ID Check (Fingerprint)
        if (deviceId && deviceId !== 'unknown') {
            const deviceUsed = await User.findOne({ deviceId });
            if (deviceUsed) {
                return res.status(403).json({ success: false, message: 'This device has already been used for registration. Please log in.' });
            }
        }
        
        // 💡 2. IP Address Check (IP එක හිස් නැත්නම් පමණක්)
        if (registrationIp) {
            const ipUsed = await User.findOne({ registrationIp });
            if (ipUsed) {
                return res.status(403).json({ success: false, message: 'A registration from this IP Address has already been processed.' });
            }
        }

        // 3. Email Check
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        let initialCoins = INITIAL_COINS;
        let referrer = null;
        let messageSuffix = '';

        // 4. Referral Logic
        if (referralCode) {
            referrer = await User.findOne({ referralCode: referralCode });
            
            if (referrer) {
                initialCoins += REFERRAL_REWARD_REFEREE;
                referrer.coins += REFERRAL_REWARD_REFERRER;
                await referrer.save(); 
                
                messageSuffix = ` (Referred by ${referralCode}. You got ${REFERRAL_REWARD_REFEREE} extra coins!)`;
            } else {
                messageSuffix = ' (Invalid referral code. Normal bonus applied.)';
            }
        }

        // 5. නව පරිශීලකයා නිර්මාණය කරන්න
        const user = await User.create({
            email,
            password,
            apiKey: generateApiKey(), 
            coins: initialCoins, 
            referrerId: referrer ? referrer._id : null,
            deviceId: (deviceId && deviceId !== 'unknown') ? deviceId : null, 
            registrationIp: registrationIp || null, // 💡 IP address ගබඩා කරන්න
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                email: user.email,
                apiKey: user.apiKey,
                coins: user.coins,
                referralCode: user.referralCode, 
                message: `Registration successful! Your API Key generated with ${user.coins} coins.` + messageSuffix
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ... (authUser - referralCode එක response එකට එකතු කරන්න)
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                email: user.email,
                apiKey: user.apiKey,
                coins: user.coins, 
                referralCode: user.referralCode, // 💡 Referral Code
                message: 'Login successful! Use this API Key to access protected routes.'
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ... (googleAuthSuccess - referralCode එක response එකට එකතු කරන්න)
const googleAuthSuccess = async (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Google login successful! Save your API Key.",
            email: req.user.email,
            apiKey: req.user.apiKey,
            coins: req.user.coins, 
            referralCode: req.user.referralCode,
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
