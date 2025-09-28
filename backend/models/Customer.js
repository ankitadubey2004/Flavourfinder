const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    // --- Authentication Fields ---
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Do not return password by default
    },
    role: {
        type: String,
        default: 'customer', // Hardcoded role
        immutable: true
    },
    // --- Customer-Specific Fields ---
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Vendor' // Reference to the Vendor model
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);