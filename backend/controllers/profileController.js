const path = require("path");
const fs = require("fs").promises;
const sharp = require("sharp");
const { PROFILE_PICTURE_FOLDER, DATA_FOLDER } = require("../config/config");

const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        const file = req.file;

        if (file) {
            const fileName = "profile.jpg";
            const filePath = path.join(PROFILE_PICTURE_FOLDER, fileName);

            await sharp(file.buffer)
                .resize(300, 300)
                .jpeg({ quality: 90 })
                .toFile(filePath);
        }

        await fs.writeFile(path.join(DATA_FOLDER, "bio.txt"), bio);

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error updating profile",
            error: error.message,
        });
    }
};

module.exports = { updateProfile };
