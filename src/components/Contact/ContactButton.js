// src/components/Contact/ContactButton.js
import React from 'react';
import { useContact } from '../../contexts/ContactContext';

const ContactButton = () => {
    const { openForm } = useContact(); // Get openForm function from context

    return (
        <button
            className="font-semibold relative 
                   border-2 border-comfy-dark bg-transparent border-opacity-50
                   p-1 px-2 rounded-md shadow-md
                   hover:bg-comfylight-accent1 focus:bg-comfylight-accent2 transition duration-300 
                   ease-in-out transform hover:scale-105"
            onClick={openForm}
        >
            <span className="text-md relative inset-0 flex items-center justify-center text-comfy-dark">
                Contact
            </span>
        </button>
    );
};

export default ContactButton;
