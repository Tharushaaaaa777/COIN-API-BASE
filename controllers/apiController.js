const { tiktok } = require('../scrapers/tiktokScraper');
const User = require('../models/User'); 

const TIKTOK_COST = 5; 

// API Key සත්‍යාපනයෙන් පසු Scraper එකට ප්‍රවේශ වීම
const getTiktokVideo = async (req, res) => {
    const { url } = req.query; 
    
    // 1. Coin check කරන්න
    if (req.user.coins < TIKTOK_COST) {
        return res.status(402).json({ 
            success: false, 
            message: `Payment Required: You need ${TIKTOK_COST} coins. Current coins: ${req.user.coins}` 
        });
    }

    if (!url) {
        return res.status(400).json({ 
            success: false, 
            message: 'TikTok video URL is required in query parameter.' 
        });
    }

    try {
        const result = await tiktok(url);
        
        if (result.success) {
            // 2. ඉල්ලීම සාර්ථක නම් Coin කපා හරින්න
            req.user.coins -= TIKTOK_COST;
            await req.user.save();

            res.json({
                ...result,
                coins_remaining: req.user.coins, 
            });
        } else {
            // Scraper fail නම් Coin කපන්නේ නැත
            res.status(500).json(result); 
        }
    } catch (error) {
        // ... (error handling)
    }
};

// API Key ලබාදෙන Route එක (Coins Display එක එකතු කරන්න)
const getApiKey = (req, res) => {
    res.json({
        success: true,
        email: req.user.email,
        apiKey: req.user.apiKey,
        coins: req.user.coins, 
        message: 'Your personal API Key and current coin balance.'
    });
};


module.exports = { 
    getTiktokVideo, 
    getApiKey 
};
