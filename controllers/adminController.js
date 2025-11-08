// controllers/adminController.js

const User = require('../models/User');

const sendCoins = async (req, res) => {
    // Owner ගේ විස්තර req.user වලින් ලැබේ
    const owner = req.user; 
    
    // Request Body එකෙන් අවශ්‍ය දත්ත ලබා ගැනීම
    const { receiverEmail, amount } = req.body;

    // 1. Inputs වලංගු දැයි පරීක්ෂා කිරීම (ධන පූර්ණ සංඛ්‍යාවක් විය යුතුය)
    if (!receiverEmail || !amount || amount <= 0 || !Number.isInteger(amount)) {
        return res.status(400).json({ success: false, message: 'Invalid receiver email or amount (must be a positive integer).' });
    }

    // 2. ලබන්නා DB එකේ සිටී දැයි සොයා ගැනීම
    const receiver = await User.findOne({ email: receiverEmail });
    
    if (!receiver) {
        return res.status(404).json({ success: false, message: `User with email ${receiverEmail} not found.` });
    }
    
    // 3. තමන්ටම Coins යැවීම වැළැක්වීම
    if (owner.email === receiverEmail) {
        return res.status(400).json({ success: false, message: "Cannot send coins to yourself using this endpoint." });
    }


    try {
        // 4. ලබන්නාගේ Coins ප්‍රමාණය වැඩි කිරීම
        const receiverUpdateResult = await User.findOneAndUpdate(
            { email: receiverEmail },
            { $inc: { coins: amount } }, 
            { new: true } 
        );
        
        if (receiverUpdateResult) {
            res.json({
                success: true,
                message: `${amount} coins successfully transferred to ${receiverEmail}.`,
                ownerEmail: owner.email,
                receiverNewBalance: receiverUpdateResult.coins,
            });
        } else {
            throw new Error("Failed to update receiver's coins.");
        }

    } catch (error) {
        console.error('Coin Send Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during coin transfer.' });
    }
};

module.exports = { sendCoins };
