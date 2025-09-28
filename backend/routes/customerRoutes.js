const express = require('express');
const router = express.Router();
const { getOpenVendors } = require('../controllers/customerController');

// @route   GET /api/customers/vendors
// @desc    Get list of open street food vendors
// @access  Public (No middleware needed)
router.get('/vendors', getOpenVendors);

module.exports = router;