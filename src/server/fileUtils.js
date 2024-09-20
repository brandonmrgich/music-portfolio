const fs = require("fs");
const path = require("path");

// Function to handle file uploads
const uploadFile = (file, directory) => {
    return new Promise((resolve, reject) => {
        const tempPath = file.path;
        const targetPath = path.join(__dirname, "audio", directory, file.originalname);

        fs.rename(tempPath, targetPath, (err) => {
            if (err) reject("Error uploading file");
            resolve("File uploaded successfully");
        });
    });
};

// Function to handle file deletions
const deleteFile = (filename, directory) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, "audio", directory, filename);

        fs.unlink(filePath, (err) => {
            if (err) reject("Error deleting file");
            resolve("File deleted successfully");
        });
    });
};

module.exports = {
    uploadFile,
    deleteFile,
};
