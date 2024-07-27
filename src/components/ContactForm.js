import React, { useState, useEffect } from "react";
/**
 * Contact form component.
 * @returns {React.Component} Contact form component
 */
const ContactForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full p-2 border rounded"
            />
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                required
                className="w-full p-2 border rounded h-32"
            ></textarea>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Send
            </button>
        </form>
    );
};

export default ContactForm;
