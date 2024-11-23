// src/components/Contact/ContactForm.js
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import { useContact } from '../../contexts/ContactContext';

const ContactForm = () => {
    const { isFormOpen, closeForm, openForm } = useContact();
    const formRef = useRef(null);

    const { setFormName, formName } = useState('');
    const { setFormEmail, formEmail } = useState('');
    const { setFormMessage, formMessage } = useState('');

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

    // TODO: Changed fixed so that bounds of screen are not forcefully changed on mobile
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
                    className="fixed bottom-16 right-4 z-50 w-80 bg-comfy-light bg-opacity-75 border border-comfy-dark p-4 rounded-lg shadow-lg"
                >
                    <button
                        className="absolute top-2 right-2 text-comfy-dark focus:outline-none"
                        onClick={closeForm}
                    >
                        <FaTimes size={18} />
                    </button>
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                            required
                            content={formName}
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                            required
                            content={formEmail}
                        />
                        <textarea
                            placeholder="Your Message"
                            className="w-full p-3 border rounded bg-comfy-light bg-opacity-25 border-comfy-dark text-comfy-dark placeholder-comfy-dark resize-none focus:outline-none focus:ring-2 focus:ring-comfy-dark"
                            required
                            content={formMessage}
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full bg-comfy-light bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            onClick={sendMessage()}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactForm;
