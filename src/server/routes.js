const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { uploadFile, deleteFile } = require("./fileUtils");
const router = express.Router();

// Helper function to stream audio
const streamAudio = (req, res, directory) => {
    const filePath = path.join(__dirname, "audio", directory, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline");

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
};

// Route for wip files
router.get("/wip/:filename", (req, res) => {
    streamAudio(req, res, "wip");
});

// Route for reel files
router.get("/reel/:filename", (req, res) => {
    streamAudio(req, res, "reel");
});

// Route for Scoring files
router.get("/scoring/:filename", (req, res) => {
    streamAudio(req, res, "scoring");
});

const upload = multer({ dest: "audio/uploads/" });

router.post("/upload/:type", upload.single("audio"), async (req, res) => {
    const { type } = req.params;
    const validTypes = ["inwork", "samplereel", "scoring"];

    if (!validTypes.includes(type)) {
        return res.status(400).send("Invalid type");
    }

    try {
        const message = await uploadFile(req.file, type);
        res.send(message);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete("/delete/:type/:filename", async (req, res) => {
    const { type, filename } = req.params;
    const validTypes = ["wip", "reel", "scoring"];

    if (!validTypes.includes(type)) {
        return res.status(400).send("Invalid type");
    }

    try {
        const message = await deleteFile(filename, type);
        res.send(message);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
