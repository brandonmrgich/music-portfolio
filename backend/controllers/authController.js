const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET } = require("../config/config");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || !(await bcrypt.compare(password, ADMIN_PASSWORD_HASH))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({ token });
};

module.exports = { login };
