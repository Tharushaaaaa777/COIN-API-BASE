// middleware/ownerMiddleware.js

const authorizeOwner = (req, res, next) => {
    // .env වෙතින් ownerEmail එක ලබා ගනී
    const ownerEmail = process.env.OWNER_EMAIL; 

    // පරිශීලකයා ලොග් වී ඇත්දැයි සහ Email එක Owner Email එකට සමානදැයි පරීක්ෂා කිරීම
    if (req.user && req.user.email === ownerEmail) {
        next();
    } else {
        // Owner නොවේ නම්, 403 Forbidden ප්‍රවේශය ප්‍රතික්ෂේප කරන්න
        res.status(403).json({ success: false, message: 'Access denied: Only the defined owner can perform this action.' });
    }
};

module.exports = { authorizeOwner };
