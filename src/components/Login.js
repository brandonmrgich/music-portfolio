import React, { useState } from "react";
import { useAdmin } from '../contexts/AdminContext';

const Login = ({ onSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAdmin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Invalid username or password");
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
    );
};

export default Login;
