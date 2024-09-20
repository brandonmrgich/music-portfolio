const express = require("express");
const router = express.Router();
const { updateServices } = require("../controllers/servicesController");
const authenticateToken = require("../middleware/auth");

router.put("/update-services", authenticateToken, updateServices);

module.exports = router;
