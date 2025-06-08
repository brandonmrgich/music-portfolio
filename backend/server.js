require('dotenv').config();

const { isDev, AUDIO_DIRECTORY } = require('./config/server_config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

// Import configurations and middleware
const configMiddleware = require('./middleware/configMiddleware');
const corsOptions = require('./config/cors');
const s3Middleware = require('./middleware/s3Middleware');

// Import API routes
const emailRoutes = require('./routes/emailRoutes');
const hbRoutes = require('./routes/heartbeatRoutes');
const tracksRoutes = require('./routes/tracksRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { startManifestCacheAutoRefresh } = require('./controllers/manifestController');
const { getS3Instance } = require('./utils/S3Helper');

const app = express();
const port = 5000; // 80 & 443 reverse proxied via nginx on prod

// --- Startup logging ---
console.log(`[BOOT] CORS Origin: ${require('./config/cors').origin}`);

// Apply middleware
app.use(configMiddleware);
app.use(express.urlencoded({ extended: true })); // For form-data URL encoding
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors(corsOptions)); // Apply CORS
app.use(s3Middleware); // Attach S3 client to all requests

// --- Request logger middleware ---
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// for nginx 
app.set('trust proxy', 1); 

const sessionSecret = process.env.SESSION_SECRET || 'dev_secret';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: !isDev, 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
}));

// Use API routes
app.use('/email', emailRoutes);
app.use('/heartbeat', hbRoutes);
app.use('/tracks', tracksRoutes);
app.use('/admin', adminRoutes);

// Start the manifest cache auto-refresh on server startup
startManifestCacheAutoRefresh({ s3: getS3Instance() });

// Start the server
app.listen(port, () => {
    console.log(`[BOOT] Server running at http://localhost:${port}`);
});
