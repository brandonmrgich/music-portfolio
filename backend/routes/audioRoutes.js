const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    uploadAudio,
    removeAudio,
    handleAudioStreaming,
} = require("../controllers/audioController");
const authenticateToken = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-audio/:type", authenticateToken, upload.single("audio"), uploadAudio);

router.delete("/remove-audio/:type/:fileName", authenticateToken, removeAudio);

router.get("/stream-audio/:type/:filename", handleAudioStreaming);
/*
 * Streaming
 *
 */

// Helper function to stream audio
// const streamAudio = (req, res, directory) => {
//     const filePath = path.join(__dirname, "audio", directory, req.params.filename);
//
//     if (!fs.existsSync(filePath)) {
//         return res.status(404).send("File not found");
//     }
//
//     res.setHeader("Content-Type", "audio/mpeg");
//     res.setHeader("Content-Disposition", "inline");
//
//     const readStream = fs.createReadStream(filePath);
//     readStream.pipe(res);
// };
//
// // Route for wip files
// router.get("/wip/:filename", (req, res) => {
//     streamAudio(req, res, "wip");
// });
//
// // Route for reel files
// router.get("/reel/:filename", (req, res) => {
//     streamAudio(req, res, "reel");
// });
//
// // Route for Scoring files
// router.get("/scoring/:filename", (req, res) => {
//     streamAudio(req, res, "scoring");
// });

module.exports = router;
