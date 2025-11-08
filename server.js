// server.js (අවසාන API Route කොටස)

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');
const requestIp = require('request-ip'); 
// 💡 නව Admin Route එක ආනයනය කරන්න
const adminRoutes = require('./routes/adminRoutes'); 

connectDB();
const app = express();
const INITIAL_COINS = 50; 

// EJS & Parser Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(requestIp.mw()); 

// Passport & Session Setup
app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false,
    saveUninitialized: true
}));

// Google Strategy Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = await User.create({
                    email: email,
                    googleId: profile.id,
                    apiKey: uuidv4(), 
                    coins: INITIAL_COINS, 
                    deviceId: null,
                    registrationIp: null,
                });
            }
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
));

passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// EJS Templating Middleware
app.use((req, res, next) => {
    if (req.isAuthenticated() && req.user) {
        res.locals.user = req.user;
        res.locals.userApiKey = req.user.apiKey; 
        res.locals.userCoins = req.user.coins;
        res.locals.isLoggedIn = true;
    } else {
        res.locals.user = null;
        res.locals.userApiKey = 'Login to get your key';
        res.locals.userCoins = 0;
        res.locals.isLoggedIn = false;
    }
    next();
});

// Frontend Routes (EJS Views)
app.get('/', (req, res) => {
    res.render('index', { 
        apiKey: res.locals.userApiKey, 
        coins: res.locals.userCoins 
    });
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.get('/ref/:referralCode', (req, res) => {
    const refCode = req.params.referralCode;
    
    res.render('register', { 
        initialReferralCode: refCode
    });
});

app.get('/signup', (req, res) => {
    res.render('register', { 
        initialReferralCode: req.query.ref || '' 
    });
});

// Google Auth Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/api/auth/google/success'); 
    }
);


// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api', apiRoutes); 

// 💡 Admin Routes එකතු කිරීම
app.use('/api/admin', adminRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
