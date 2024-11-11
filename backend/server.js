const express = require('express');
const { ensureFolderExists } = require('./helpers/fileHelpers');
const { PROFILE_PICTURE_FOLDER, DATA_FOLDER, PORT } = require('./config/config');
const AudioTypes = require('./schema/audioTypes');
const authRoutes = require('./routes/authRoutes');
const audioRoutes = require('./routes/audioRoutes');
const profileRoutes = require('./routes/profileRoutes');
const servicesRoutes = require('./routes/servicesRoutes');

const app = express();
app.use(express.json());

// Ensure all required folders exist
(async () => {
    await Promise.all([
        ensureFolderExists(AudioTypes.AudioTypes.AUDIO_WIP),
        ensureFolderExists(AudioTypes.AudioTypes.AUDIO_REEL),
        ensureFolderExists(AudioTypes.AudioTypes.AUDIO_SCORING),
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
    console.info(`Server running on port ${PORT}`);
});
