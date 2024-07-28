import React, { useState, useEffect, useRef } from "react";

/**
 * Contact form component.
 * @returns {React.Component} Contact form component
 */
const ContactForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., send email)
        console.debug("Form submitted:", { name, email, message });

        // TODO: API call

        // Reset form fields
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
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            handleTextareaChange();
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6 border rounded shadow-md mx-auto bg-gray-50 bg-blend-multiply bg-opacity-50 backdrop-blur-sm"
        >
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                style={{ overflow: "hidden" }}
            ></textarea>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
                Send
            </button>
        </form>
    );
};

export default ContactForm;
