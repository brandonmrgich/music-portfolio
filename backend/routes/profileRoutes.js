const express = require("express");
const router = express.Router();
const multer = require("multer");
const { updateProfile } = require("../controllers/profileController");
const authenticateToken = require("../middlewares/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.put(
    "/update-profile",
    authenticateToken,
    upload.single("profilePicture"),
    updateProfile,
);

module.exports = router;
