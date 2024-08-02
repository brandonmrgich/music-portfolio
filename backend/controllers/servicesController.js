const path = require("path");
const fs = require("fs").promises;
const { DATA_FOLDER } = require("../config/config");

const updateServices = async (req, res) => {
    try {
        const { servicesText } = req.body;
        await fs.writeFile(
            path.join(DATA_FOLDER, "services.txt"),
            servicesText,
        );
        res.json({ message: "Services page updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error updating services page",
            error: error.message,
        });
    }
};

module.exports = { updateServices };
