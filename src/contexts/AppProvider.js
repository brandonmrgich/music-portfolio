import React from "react";
import { AudioProvider } from "./AudioContext";
import { ContactProvider } from "./ContactContext";

// All providers will be nested here
const AppProvider = ({ children }) => {
    return (
        <AudioProvider>
            <ContactProvider>{children}</ContactProvider>
        </AudioProvider>
    );
};

export default AppProvider;
