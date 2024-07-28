import React from "react";

const SocialMediaLink = ({ href, icon: Icon, colorClass, label }) => {
    return (
        <li className="flex flex-col items-center p-2 rounded-full border border-gray-300 hover:bg-blue-100 transition">
            <a
                className="flex flex-col items-center space-y-1 text-blue-800 hover:text-blue-300"
                href={href}
            >
                <Icon className={`text-4xl ${colorClass}`} />
                <span>{label}</span>
            </a>
        </li>
    );
};

export default SocialMediaLink;
