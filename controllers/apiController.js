const User = require('../models/User'); 
// 💡 ඔබගේ TikTok Scraper Logic එක ආනයනය කර ඇත
const { tiktok } = require('../scrapers/tiktokScraper'); 

const TIKTOK_COST = 5; // එක් TikTok API Call එකක් සඳහා අවශ්‍ය Coins ප්‍රමාණය

// 1. TikTok Video Data ලබා දෙන Endpoint එක
const getTiktokVideo = async (req, res) => {
    const user = req.user; 
    
    // 💡 Query Parameter එකෙන් TikTok URL එක ලබා ගැනීම
    const url = req.query.url; 

    if (!url) {
        return res.status(400).json({ success: false, message: 'TikTok URL is required as a query parameter (?url=...).' });
    }
    
    // 1. Coin ශේෂය පරීක්ෂා කිරීම
    if (user.coins < TIKTOK_COST) {
        return res.status(402).json({ success: false, message: `Insufficient coins. You need ${TIKTOK_COST} coins for this request.` });
    }

    try {
        // 2. TikTok Scraper Logic එක ක්‍රියාත්මක කිරීම
        const data = await tiktok(url); 

        // 3. Scraper එක සාර්ථක නම් Coin අඩු කිරීම
        if (data && data.success) {
            user.coins -= TIKTOK_COST;
            await user.save(); 
            
            res.json({
                success: true,
                message: 'TikTok data retrieved successfully.',
                coinsRemaining: user.coins,
                data: data.result, 
            });
        } else {
            // Scraper එක අසමත් වුවහොත්
            res.status(404).json({ success: false, message: data ? data.message : 'Error processing TikTok URL.' });
        }

    } catch (error) {
        console.error('TikTok API Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error during TikTok processing.' });
    }
};

// 2. API Key/Coin Balance ලබා දෙන Endpoint එක (වෙනස් වී නැත, නමුත් සම්පූර්ණත්වය සඳහා)
const getApiKey = (req, res) => {
    res.json({
        success: true,
        email: req.user.email,
        apiKey: req.user.apiKey,
        coins: req.user.coins, 
        referralCode: req.user.referralCode,
        message: 'Your personal API Key and current coin balance.'
    });
};

module.exports = { 
    getTiktokVideo, 
    getApiKey 
};
