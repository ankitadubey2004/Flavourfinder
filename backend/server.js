const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- CORS import
const connectDB = require('./config/db');

// --- Configuration Setup ---

// 1. Load environment variables from .env file (MUST be at the top)
dotenv.config();

// 2. Connect to the database
connectDB();

const app = express();

// --- Middleware ---

// 1. CORS Middleware: Allows the frontend (e.g., React on port 5173) to access the backend (port 5000)
// Development में, आप सभी origins (*) को अनुमति दे सकते हैं, या सिर्फ अपने frontend URL को।
// Production के लिए, सिर्फ अपने domain को allow करें।
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your actual React/Vite dev port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// 2. Body Parser: Allows the server to accept JSON data in the request body
app.use(express.json());

// --- Routes ---

// Basic Root Route for testing server status
app.get('/', (req, res) => {
    res.send('Flavour Finders API is Running...');
});

// Authentication Routes (Signup and Login)
app.use('/api/auth', require('./routes/authRoutes'));

// TODO: Future Routes for Vendor Management and Customer Discovery
// app.use('/api/vendors', require('./routes/vendorRoutes')); 
// app.use('/api/customers', require('./routes/customerRoutes'));

// --- Server Start ---

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);