const fs = require("fs").promises;
const { AudioTypes } = require("../schema/audioTypes");

// TODO: All catches need to log somewhere

const getFolderForType = (type) => {
    try {
        folder = AudioTypes[String.toString(type).toLowerCase()];
    } catch (e) {
        // No matching audio type, handle
    }
    return folder;
};

const ensureFolderExists = async (folderPath) => {
    try {
        await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }
};

const updateAudioList = async (folder, audioInfo) => {
    const listPath = path.join(folder, "list.json");
    let list = [];
    try {
        const data = await fs.readFile(listPath, "utf8");
        list = JSON.parse(data);
    } catch (error) {
        // File doesn't exist or is empty, start with an empty list
    }
    list.push(audioInfo);
    await fs.writeFile(listPath, JSON.stringify(list, null, 2));
};

const removeFromAudioList = async (folder, fileName) => {
    const listPath = path.join(folder, "list.json");
    let list = [];
    try {
        const data = await fs.readFile(listPath, "utf8");
        list = JSON.parse(data);
        list = list.filter((item) => item.fileName !== fileName);
        await fs.writeFile(listPath, JSON.stringify(list, null, 2));
    } catch (error) {
        // File doesn't exist or is empty, nothing to remove
    }
};

module.exports = {
    ensureFolderExists,
    updateAudioList,
    removeFromAudioList,
    getFolderForType,
};
