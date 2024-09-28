import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa"; // Icons for toggle buttons

const ContactForm = () => {
    const [isOpen, setIsOpen] = useState(false); // Manage open/close state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.debug("Form submitted:", { name, email, message });
        // TODO: API call
        setName("");
        setEmail("");
        setMessage("");
    };

    const handleTextareaChange = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    };

    useEffect(() => {
        handleTextareaChange(); // Adjust textarea height initially
    }, [message]);

    // Toggle between open and close
    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="relative w-80 bg-comfylight-light bg-opacity-75 border border-comfy-dark p-4 rounded-lg shadow-lg">
                    <button
                        className="absolute top-2 right-2 text-comfy-dark focus:outline-none"
                        onClick={toggleForm}
                    >
                        <FaTimes size={18} />
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            required
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                        />
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                handleTextareaChange();
                            }}
                            placeholder="Your Message"
                            required
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark resize-none focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                            style={{ overflow: "hidden" }}
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full bg-comfy-light bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    className="bg-comfy-light text-comfy-dark p-3 rounded-full shadow-lg hover:bg-comfy-dark hover:text-white transition-colors focus:outline-none"
                    onClick={toggleForm}
                >
                    <FaEnvelope size={24} />
                </button>
            )}
        </div>
    );
};

export default ContactForm;
