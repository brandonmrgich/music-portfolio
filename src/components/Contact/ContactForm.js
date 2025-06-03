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
                className="fixed bottom-4 right-4 z-50 bg-surface-light dark:bg-surface-dark p-2 rounded-full shadow-lg border border-border-light dark:border-border-dark"
                onClick={openForm}
                aria-label="Open Contact Form"
            >
                <FaEnvelope size={24} className="text-text-light dark:text-text-dark" />
            </button>

            {isFormOpen && (
                <div
                    ref={formRef}
                    className="fixed bottom-16 right-4 z-50 w-96 bg-surface-light dark:bg-surface-dark bg-opacity-90 border border-border-light dark:border-border-dark p-6 rounded-lg shadow-lg space-y-4"
                >
                    <button
                        className="absolute top-2 right-2 text-text-light dark:text-text-dark focus:outline-none"
                        onClick={closeForm}
                    >
                        <FaTimes size={18} />
                    </button>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-4 border rounded bg-surface-light dark:bg-surface-dark bg-opacity-60 border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder-text-light dark:placeholder-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                                required
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-4 border rounded bg-surface-light dark:bg-surface-dark bg-opacity-60 border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder-text-light dark:placeholder-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                                required
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <textarea
                                placeholder="Your Message"
                                className="w-full p-4 border rounded bg-surface-light dark:bg-surface-dark bg-opacity-60 border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder-text-light dark:placeholder-text-dark resize-none focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                                required
                                value={formMessage}
                                onChange={(e) => setFormMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="space-y-2">
                            <button
                                type="submit"
                                className="w-full bg-button-light dark:bg-button-dark text-buttonText-light dark:text-buttonText-dark px-4 py-2 rounded-lg hover:bg-accent-light dark:hover:bg-accent-dark transition-colors"
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
