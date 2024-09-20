const fs = require("fs");
const path = require("path");

const streamAudio = (res, filePath) => {
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline");

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
};

module.exports = {
    streamAudio,
};
