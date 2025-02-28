require('dotenv').config();

const { isDev, AUDIO_DIRECTORY } = require('./config/server_config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import configurations and middleware
const configMiddleware = require('./middleware/configMiddleware');
const corsOptions = require('./config/cors');
const s3Middleware = require('./middleware/s3Middleware');

// Import API routes
const emailRoutes = require('./routes/emailRoutes');
const hbRoutes = require('./routes/heartbeatRoutes');
const tracksRoutes = require('./routes/tracksRoutes');

const app = express();
const port = 5000; // 80 & 443 reverse proxied via nginx on prod

// Apply middleware
app.use(configMiddleware);
app.use(cors(corsOptions)); // Apply CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(s3Middleware); // Attach S3 client to all requests

// Use API routes
app.use('/email', emailRoutes);
app.use('/heartbeat', hbRoutes);
app.use('/tracks', tracksRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
