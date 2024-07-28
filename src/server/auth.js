import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
    });
};

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Add these new functions
export const createUser = async (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        throw new Error("Username already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
};

export const authenticateUser = async (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((user) => user.username === username);
    if (!user) {
        throw new Error("User not found");
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        throw new Error("Invalid password");
    }
    return user;
};
