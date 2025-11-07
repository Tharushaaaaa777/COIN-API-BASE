const User = require('../models/User');
const OWNER_EMAIL = process.env.OWNER_EMAIL; 

// Coin එකතු කිරීමේ ක්‍රියාවලිය
const addCoins = async (req, res) => {
    // 1. Security Check: ඉල්ලීම කරන්නේ Owner ට පමණක්දැයි පරීක්ෂා කරන්න
    if (req.user.email !== OWNER_EMAIL) {
        return res.status(403).json({ success: false, message: 'Forbidden: Owner access only.' });
    }

    const { targetEmail, amount } = req.body;

    if (!targetEmail || !amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid targetEmail or amount. Amount must be a positive number.' });
    }

    try {
        const targetUser = await User.findOne({ email: targetEmail });

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'Target user not found.' });
        }

        // 2. Coin එකතු කිරීම
        targetUser.coins += amount;
        await targetUser.save();

        res.json({
            success: true,
            message: `${amount} coins added to ${targetEmail}.`,
            new_coin_balance: targetUser.coins,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating coins.' });
    }
};

module.exports = { addCoins };
