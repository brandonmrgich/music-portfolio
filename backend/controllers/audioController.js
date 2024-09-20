const path = require("path");
const fs = require("fs").promises;
const {
    updateAudioList,
    removeFromAudioList,
    getFolderForType,
} = require("../helpers/fileHelpers");

const uploadAudio = async (req, res) => {
    try {
        const { title, artist, type } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const targetFolder = getFolderForType(type);

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(targetFolder, fileName);

        await fs.writeFile(filePath, file.buffer);

        const audioInfo = { title, artist, fileName };
        await updateAudioList(targetFolder, audioInfo);

        res.json({ message: "Audio uploaded successfully", audioInfo });
    } catch (error) {
        res.status(500).json({
            message: "Error uploading audio",
            error: error.message,
        });
    }
};

const removeAudio = async (req, res) => {
    try {
        const { fileName } = req.params;
        const { type } = req.query;

        const targetFolder = getFolderForType(type);

        const filePath = path.join(targetFolder, fileName);

        await fs.unlink(filePath);
        await removeFromAudioList(targetFolder, fileName);

        res.json({ message: "Audio removed successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error removing audio",
            error: error.message,
        });
    }
};

const handleAudioStreaming = (req, res) => {
    const { type, filename } = req.params;
    const validTypes = ["inwork", "samplereel", "scoring"];

    if (!validTypes.includes(type)) {
        return res.status(400).send("Invalid type");
    }

    const filePath = path.join(config.audioDirectory, type, filename);
    streamAudio(res, filePath);
};

module.exports = { uploadAudio, removeAudio, handleAudioStreaming };
