const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');

// NOTE: JWT_SECRET must be in your .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes (checks if user is logged in)
exports.protect = async (req, res, next) => {
    let token;

    // Check if the token is present in the headers (Authorization: Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach user data (id and role) to the request object
            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            next(); // Move to the next middleware or controller function
        } catch (error) {
            console.error(error);
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Middleware to check if the user has a specific role (e.g., 'vendor')
exports.roleCheck = (allowedRole) => (req, res, next) => {
    // This assumes the 'protect' middleware has already run and attached req.user
    if (req.user && req.user.role === allowedRole) {
        next();
    } else {
        res.status(403).json({ msg: `Access denied. Requires ${allowedRole} role.` });
    }
};