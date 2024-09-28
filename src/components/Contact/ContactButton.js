// src/components/Contact/ContactButton.js
import React from "react";
import { useContact } from "./ContactContext";

const ContactButton = () => {
    const { openForm } = useContact(); // Get openForm function from context

    return (
        <button className="bg-comfy-light p-2 rounded shadow-lg" onClick={openForm}>
            Contact
        </button>
    );
};

export default ContactButton;
