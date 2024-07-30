import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { authenticateUser, generateToken } from "../utils/auth";

const Login = ({ setIsAdmin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //const user = await authenticateUser(username, password);
            //const token = generateToken(user);

            // TODO: create api call

            // setIsAdmin(true);
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full p-2 border rounded"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded"
            >
                Login
            </button>
        </form>
    );
};

export default Login;
