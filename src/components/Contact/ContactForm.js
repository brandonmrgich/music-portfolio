import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import { useContact } from '../../contexts/ContactContext';

const ContactForm = () => {
    const { isFormOpen, closeForm, openForm } = useContact();
    const formRef = useRef(null);

    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formMessage, setFormMessage] = useState('');

    const sendMessage = () => {};

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                closeForm();
            }
        };

        if (isFormOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFormOpen, closeForm]);

    return (
        <div>
            {/* Envelope icon button always visible */}
            <button
                className="fixed bottom-4 right-4 z-50 bg-comfy-light p-2 rounded-full shadow-lg"
                onClick={openForm}
                aria-label="Open Contact Form"
            >
                <FaEnvelope size={24} className="text-comfy-dark" />
            </button>

            {isFormOpen && (
                <div
                    ref={formRef}
                    className="fixed bottom-16 right-4 z-50 w-96 bg-comfy-light bg-opacity-75 border border-comfy-dark p-6 rounded-lg shadow-lg space-y-4"
                >
                    <button
                        className="absolute top-2 right-2 text-comfy-dark focus:outline-none"
                        onClick={closeForm}
                    >
                        <FaTimes size={18} />
                    </button>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-4 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                                required
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-4 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                                required
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <textarea
                                placeholder="Your Message"
                                className="w-full p-4 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark resize-none focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                                required
                                value={formMessage}
                                onChange={(e) => setFormMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="space-y-2">
                            <button
                                type="submit"
                                className="w-full bg-comfy-light bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactForm;
