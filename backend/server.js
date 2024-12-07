const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import API routes
//const audioRoutes = require('./routes/audio');
const emailRoutes = require('./routes/email');
//const uploadRoutes = require('./routes/upload');
const hbRoutes = require('./routes/heartbeat');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies for POST requests
// TODO: Auth

// Use the routes
//app.use('/api/audio', audioRoutes);  // All audio-related endpoints will be prefixed with /api/audio
app.use('/api/send-email', emailRoutes); // Email-related endpoints
//app.use('/api/upload', uploadRoutes);  // File upload routes
app.use('/api/heartbeat', hbRoutes);

// Serve the frontend build files (Currently nothing frontend being served)
//app.use(express.static(path.join(__dirname, '../build')));

// Catch-all for frontend routing (if needed)
//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../build/index.html'));
//});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
