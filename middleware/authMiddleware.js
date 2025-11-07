const User = require('../models/User');

const protect = async (req, res, next) => {
    let apiKey;

    // 💡 1. Query Parameter එක පරීක්ෂා කිරීම (?x-api-key=...)
    if (req.query && req.query['api-key']) {
        apiKey = req.query['api-key'];
    } 
    // 2. Authorization Header එක පරීක්ෂා කිරීම (Bearer <Key>)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        apiKey = req.headers.authorization.split(' ')[1];
    }

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'Not authorized. API Key is missing or invalid.' });
    }

    try {
        // API Key එක Database එකේ පරිශීලකයෙකුට අයත් දැයි පරීක්ෂා කිරීම
        const user = await User.findOne({ apiKey }).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized. Invalid API Key.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        // DB සම්බන්ධතා හෝ අනෙකුත් අභ්‍යන්තර දෝෂ හසුරුවයි
        res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
};

module.exports = { protect };
