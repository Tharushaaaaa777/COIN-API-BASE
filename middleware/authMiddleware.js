const User = require('../models/User');

const protect = async (req, res, next) => {
    let apiKey;

    if (req.headers['x-api-key']) {
        apiKey = req.headers['x-api-key'];
    }

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'Not authorized, API Key is missing' });
    }

    try {
        const user = await User.findOne({ apiKey });

        if (user) {
            req.user = user; 
            next();
        } else {
            res.status(401).json({ success: false, message: 'Not authorized, invalid API Key' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during API Key validation' });
    }
};

module.exports = { protect };
