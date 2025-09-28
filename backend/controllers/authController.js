const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');

// NOTE: You must set these in your .env file
// JWT_SECRET="YOUR_JWT_SECRET_KEY"
// JWT_EXPIRES_IN="30d" 
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

// --- 1. Vendor Registration ---
exports.registerVendor = async (req, res) => {
    // Note: The frontend needs to send all required fields:
    // email, password, shopName, contactNumber, specialtyDish, address, location (coordinates)
    const { email, password, shopName, contactNumber, specialtyDish, address, location } = req.body;

    try {
        // 1. Check if Vendor already exists
        let vendor = await Vendor.findOne({ email });
        if (vendor) {
            return res.status(400).json({ msg: 'Vendor with this email already exists' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create New Vendor
        vendor = new Vendor({
            email,
            password: hashedPassword,
            shopName,
            contactNumber,
            specialtyDish,
            address,
            location // Assuming location object is passed correctly from the frontend
        });

        await vendor.save();

        // 4. Generate Token & Respond
        const token = generateToken(vendor._id, vendor.role);

        res.status(201).json({
            token,
            user: {
                id: vendor._id,
                shopName: vendor.shopName,
                email: vendor.email,
                role: vendor.role
            },
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during Vendor Registration');
    }
};

// --- 2. Customer Registration ---
exports.registerCustomer = async (req, res) => {
    // Note: The frontend needs to send: email, password, username
    const { email, password, username } = req.body;

    try {
        // 1. Check if Customer already exists
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ msg: 'Customer with this email already exists' });
        }
        
        // Also check if username is taken (optional but good practice)
        let usernameCheck = await Customer.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ msg: 'Username is taken' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create New Customer
        customer = new Customer({
            email,
            password: hashedPassword,
            username
        });

        await customer.save();

        // 4. Generate Token & Respond
        const token = generateToken(customer._id, customer.role);

        res.status(201).json({
            token,
            user: {
                id: customer._id,
                username: customer.username,
                email: customer.email,
                role: customer.role
            },
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during Customer Registration');
    }
};

// --- 3. Unified Login for both Customer and Vendor ---
exports.login = async (req, res) => {
    // Note: The frontend needs to send: email, password, and the 'role' (e.g., 'customer' or 'vendor')
    const { email, password, role } = req.body;

    if (!role || (role !== 'customer' && role !== 'vendor')) {
        return res.status(400).json({ msg: 'Login role must be specified (customer or vendor)' });
    }

    try {
        let User; // Variable to hold the correct Mongoose model
        let user; // Variable to hold the found user object

        // A. Select the correct Mongoose model based on the requested role
        if (role === 'customer') {
            User = Customer;
        } else {
            User = Vendor;
        }

        // B. Find the user by email, explicitly selecting the password field
        user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials (User not found)' });
        }

        // C. Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials (Password mismatch)' });
        }

        // D. Generate Token & Respond
        const token = generateToken(user._id, user.role);

        // Prepare response data (excluding the password)
        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
            // Add specific name/shopName based on role
            name: role === 'customer' ? user.username : user.shopName
        };

        res.status(200).json({
            token,
            user: userData,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during Login');
    }
};