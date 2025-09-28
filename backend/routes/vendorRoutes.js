const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/authMiddleware');
// You will create this controller next
const { getVendorProfile, updateVendorProfile } = require('../controllers/vendorController'); 

// @route   GET /api/vendors/profile
// @desc    Get the logged-in vendor's own profile
// @access  Private (Vendor Only)
router.get('/profile', protect, roleCheck('vendor'), getVendorProfile);

// @route   PUT /api/vendors/profile
// @desc    Update the logged-in vendor's profile details
// @access  Private (Vendor Only)
router.put('/profile', protect, roleCheck('vendor'), updateVendorProfile);

module.exports = router;