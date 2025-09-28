const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    // --- Authentication Fields ---
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
        select: false // Ensures password is not returned in queries by default
    },
    role: {
        type: String,
        default: 'vendor', // Hardcoded role for easy differentiation
        immutable: true
    },
    // --- Business Information Fields ---
    shopName: {
        type: String,
        required: [true, 'Shop name is required'],
        trim: true
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    specialtyDish: {
        type: String,
        required: [true, 'Specialty dish is required'],
        trim: true
    },
    // --- Location and Availability Fields ---
    // Stores human-readable address
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    // Stores coordinates for map integration (GeoJSON format)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'Coordinates are required']
        }
    },
    isClosed: {
        type: Boolean,
        default: false // The primary way vendors manage daily availability
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create a geospatial index for efficient location querying
VendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', VendorSchema);