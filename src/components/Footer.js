import React from "react";
import { SocialMediaLink, Links } from "./SocialMediaLink";

const Footer = () => {
    const links = Links.Streaming;
    return (
        <footer className=" footer p-6 h-min ">
            <section className="links-section mb-8">
                <ul className="flex justify-center gap-4 flex-wrap">
                    {Object.values(links).map(({ href, icon, colorClass, label }) => (
                        <SocialMediaLink
                            key={label}
                            href={href}
                            icon={icon}
                            colorClass={colorClass}
                            label={label}
                        />
                    ))}
                </ul>
                <p className="flex justify-center arr text-xs font-extralight mb-6 text-gray-400 max-h-3">
                    &copy; 2024 Brandon Mrgich. All rights reserved.
                </p>
            </section>
        </footer>
    );
};

export default Footer;
