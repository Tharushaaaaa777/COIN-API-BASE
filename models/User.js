const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    apiKey: { 
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
    },
    coins: {
        type: Number,
        required: true,
        default: 0 
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4().substring(0, 8) 
    },
    referrerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    // 💡 Tracking Fields
    deviceId: { // Client-side Fingerprint ID
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    registrationIp: { // Server-side IP Address
        type: String,
        required: false,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
});

// ... (userSchema.pre('save') and userSchema.methods.matchPassword)

const User = mongoose.model('User', userSchema);
module.exports = User;
