const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production.local"
            : ".env.development.local",
});

module.exports = {
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_PATH: process.env.BASE_PATH || path.join(__dirname, "..", "data"),
    PORT: process.env.PORT || 3000,
};
