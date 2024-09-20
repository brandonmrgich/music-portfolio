const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development",
});

module.exports = {
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_PATH: process.env.BASE_PATH || path.join(__dirname, "..", "data"),
    PORT: process.env.PORT || 3000,
    AUDIO_ROOT: process.env.AUDIO_ROOT,
    AUDIO_WIP: process.env.AUDIO_WIP,
    AUDIO_REEL: process.env.AUDIO_REEL,
    AUDIO_SCORING: process.env.AUDIO_SCORING,
};
