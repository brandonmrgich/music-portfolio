const express = require("express");
const router = express.Router();
const { updateServices } = require("../controllers/servicesController");
const authenticateToken = require("../middlewares/authMiddleware");

router.put("/update-services", authenticateToken, updateServices);

module.exports = router;
