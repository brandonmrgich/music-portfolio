/**
 * ContactContext - React context for managing the contact form state (open/close).
 */
import React, { createContext, useContext, useState } from "react";

const ContactContext = createContext();

/**
 * ContactProvider - Provides contact form open/close state and controls.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const ContactProvider = ({ children }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    /** Open the contact form. */
    const openForm = () => setIsFormOpen(true);
    /** Close the contact form. */
    const closeForm = () => setIsFormOpen(false);
    return (
        <ContactContext.Provider value={{ isFormOpen, openForm, closeForm }}>
            {children}
        </ContactContext.Provider>
    );
};

/**
 * useContact - React hook to access contact form state and controls.
 * @returns {object} Contact context value
 */
export const useContact = () => useContext(ContactContext);
