const express = require("express");
const { ensureFolderExists } = require("./helpers/fileHelpers");
const {
    AUDIO_FOLDER,
    SERVICES_AUDIO_FOLDER,
    PROFILE_PICTURE_FOLDER,
    DATA_FOLDER,
    PORT,
} = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const audioRoutes = require("./routes/audioRoutes");
const profileRoutes = require("./routes/profileRoutes");
const servicesRoutes = require("./routes/servicesRoutes");

const app = express();
app.use(express.json());

// Ensure all required folders exist
(async () => {
    await Promise.all([
        ensureFolderExists(AUDIO_FOLDER),
        ensureFolderExists(SERVICES_AUDIO_FOLDER),
        ensureFolderExists(PROFILE_PICTURE_FOLDER),
        ensureFolderExists(DATA_FOLDER),
    ]);
})();

// Use routes
app.use(authRoutes);
app.use(audioRoutes);
app.use(profileRoutes);
app.use(servicesRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
