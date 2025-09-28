const Vendor = require('../models/Vendor');

// @desc    Get the logged-in vendor's own profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor Only)
exports.getVendorProfile = async (req, res) => {
    try {
        // req.user.id is attached by the 'protect' middleware after token verification
        // -password, -role, -__v fields को छिपाता है
        const vendor = await Vendor.findById(req.user.id).select('-password -role -__v');
        
        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor profile not found.' });
        }

        res.json(vendor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in getVendorProfile');
    }
};

// @desc    Update the logged-in vendor's profile details (including location and status)
// @route   PUT /api/vendors/profile
// @access  Private (Vendor Only)
exports.updateVendorProfile = async (req, res) => {
    // Only allow specific fields to be updated for security
    const { 
        shopName, 
        contactNumber, 
        specialtyDish, 
        address, 
        isClosed, 
        location 
    } = req.body;
    
    // Create an object with the fields that were sent in the request body
    const updateFields = {};
    if (shopName) updateFields.shopName = shopName;
    if (contactNumber) updateFields.contactNumber = contactNumber;
    if (specialtyDish) updateFields.specialtyDish = specialtyDish;
    if (address) updateFields.address = address;
    
    // isClosed को सिर्फ तभी अपडेट करें जब वह boolean हो (true/false)
    if (typeof isClosed === 'boolean') updateFields.isClosed = isClosed; 
    
    // Handle Location Update separately (GeoJSON validation)
    if (location && location.coordinates && location.type === 'Point') {
        if (location.coordinates.length === 2 && typeof location.coordinates[0] === 'number') {
            updateFields.location = location;
        } else {
            return res.status(400).json({ msg: 'Invalid location coordinates format.' });
        }
    }

    try {
        // Find the vendor by ID (from the token) and update the fields
        let vendor = await Vendor.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true } // updated document return होगा और validation चलेगा
        ).select('-password -role -__v');

        if (!vendor) {
            return res.status(404).json({ msg: 'Vendor profile not found for update.' });
        }

        res.json({ 
            msg: 'Profile updated successfully!', 
            vendor 
        });

    } catch (err) {
        console.error(err.message);
        // Mongoose validation errors को debug करने में मदद करेगा
        res.status(500).send('Server Error during Vendor Profile Update');
    }
};