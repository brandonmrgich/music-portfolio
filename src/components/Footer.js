import React from 'react';
import { SocialMediaLink, Links } from './SocialMediaLink';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
    const links = Links.Streaming;
    return (
        <footer className="footer p-6">
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
                <div className="flex justify-center mb-2">
                    <a
                        href="https://github.com/brandonmrgich/music-portfolio"
                        className="text-gray-400 text-sm font-light flex items-center space-x-1 hover:text-comfy-accent2 transition-colors duration-300"
                    >
                        <FaGithub className="w-4 h-4" />
                        <span>GitHub</span>
                    </a>
                </div>
                <p className="flex justify-center arr text-xs font-extralight mb-6 text-gray-400">
                    &copy; 1999-2024 Brandon Mrgich. All rights reserved.
                </p>
            </section>
        </footer>
    );
};

export default Footer;
