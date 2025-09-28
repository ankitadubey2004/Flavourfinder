const express = require('express');
const router = express.Router();
const { registerVendor, registerCustomer, login } = require('../controllers/authController');

// @route   POST /api/auth/vendor/signup
// @desc    Register a new Vendor
// @access  Public
router.post('/vendor/signup', registerVendor);

// @route   POST /api/auth/customer/signup
// @desc    Register a new Customer
// @access  Public
router.post('/customer/signup', registerCustomer);

// @route   POST /api/auth/login
// @desc    Login for both Customer and Vendor (Role required in body)
// @access  Public
router.post('/login', login);

module.exports = router;