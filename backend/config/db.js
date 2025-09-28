const mongoose = require('mongoose');

// Function to connect to the database
const connectDB = async () => {
    try {
        // process.env.MONGO_URI को आपके .env फाइल से लेता है
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // अगर connection fail होता है, तो process को exit कर दें
        process.exit(1);
    }
};

// <--- ध्यान दें: connectDB फ़ंक्शन को सीधे export किया गया है
module.exports = connectDB;