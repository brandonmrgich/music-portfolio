const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Import API routes
const emailRoutes = require('./routes/email');
const hbRoutes = require('./routes/heartbeat');

const app = express();
const port = 5000;

// CORS configuration
const corsOptions = {
    origin: 'https://brandonmrgich.com', // Allow requests from this frontend domain
    methods: 'GET,POST,PUT,DELETE', // Allow only these HTTP methods
    allowedHeaders: 'Content-Type', // Allow only specific headers
    credentials: true, // Allow cookies, if necessary
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies for POST requests
// TODO: Auth

// Use the routes
app.use('/api/send-email', emailRoutes); // Email-related endpoints
app.use('/api/heartbeat', hbRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
