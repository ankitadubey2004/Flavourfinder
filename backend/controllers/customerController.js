const Vendor = require('../models/Vendor');

// @desc    Get a list of all OPEN vendors, filtered by dish or location (public access)
// @route   GET /api/customers/vendors
// @access  Public
exports.getOpenVendors = async (req, res) => {
    // Get optional query parameters from the request URL
    const { dish, location } = req.query; 

    // Build the query object
    let query = { isClosed: false }; // CRUCIAL: Only show vendors marked as OPEN

    if (dish) {
        // Use a case-insensitive regular expression for dish search
        query.specialtyDish = { $regex: dish, $options: 'i' };
    }

    // TODO: Advanced filtering by location/distance (Phase 4: Requires Geo-query)
    // if (location) { ... } 

    try {
        const vendors = await Vendor.find(query)
            .select('-email -password -role -__v') // Hide sensitive fields
            .limit(50); // Limit results for performance

        if (vendors.length === 0) {
            return res.status(200).json({ msg: 'No open vendors found matching your criteria.' });
        }

        res.json(vendors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during vendor discovery.');
    }
};