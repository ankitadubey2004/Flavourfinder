const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const connectDB = require('./config/db');

// --- Configuration Setup ---

// 1. Load environment variables from .env file (MUST be at the top)
dotenv.config();

// 2. Connect to the database
connectDB();

const app = express();

// --- Middleware ---

// 1. CORS Middleware: Allows the frontend (e.g., React on port 5173) to access the backend (port 5000)
app.use(cors({
    origin: 'http://localhost:5173', 
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

// Vendor Management Routes 
app.use('/api/vendors', require('./routes/vendorRoutes')); 

// Customer Discovery Routes (Uncommented for Phase 3)
app.use('/api/customers', require('./routes/customerRoutes')); // <--- NOW ACTIVE

// --- Server Start ---

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);