const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadAudio, removeAudio } = require("../controllers/audioController");
const authenticateToken = require("../middlewares/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
    "/upload-audio",
    authenticateToken,
    upload.single("audio"),
    uploadAudio,
);
router.delete("/remove-audio/:fileName", authenticateToken, removeAudio);

module.exports = router;
