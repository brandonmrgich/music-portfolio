import React from 'react';
import { useContact } from '../../contexts/ContactContext';
import { FaEnvelope } from 'react-icons/fa';

const ContactButton = () => {
    const { openForm } = useContact();

    return (
        <button
            className="md:mr-10 lg:mr-10 xl:mr-10 font-semibold relative
                   border-2 border-comfy-dark bg-transparent border-opacity-50
                   p-1 px-2 rounded-md shadow-md
                   hover:bg-comfylight-accent1 focus:bg-comfylight-accent2 transition duration-300 
                   ease-in-out transform hover:scale-105"
            onClick={openForm}
        >
            <span className="text-md relative inset-0 flex items-center justify-center text-comfy-dark hidden sm:inline">
                Contact
            </span>
            <span className="text-md relative inset-0 flex items-center justify-center text-comfy-dark sm:hidden">
                <FaEnvelope size={20} />
            </span>
        </button>
    );
};

export default ContactButton;
