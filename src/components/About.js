import React, { useState, useEffect } from 'react';
import defaultPfp from '../pictures/profile-default.jpg';
import getRandomProfilePicture from '../utils/getRandomProfilePicture';
import { SocialMediaLink, Links } from './SocialMediaLink';
import ContentLinks from '../utils/ContentLinks';

/**
 * About page component.
 * @returns {React.Component} The About page component
 */
const About = ({ isAdmin }) => {
    const [profilePicture, setProfilePicture] = useState(defaultPfp);
    const links = Links.Social;
    const contentLinks = ContentLinks;

    useEffect(() => {
        const randomImage = getRandomProfilePicture();
        setProfilePicture(randomImage);
    }, []);

    return (
        <div className="about p-6 max-w-4xl mx-auto space-y-12 ">
            <h1 className="text-4xl font-bold text-center mb-4 ">Brandon Mrgich</h1>
            <div className="flex flex-col items-center md:flex-row md:items-start mb-8 flex-wrap">
                <div className="mb-4 md:mb-0 md:mr-8 flex justify-center">
                    <a href="https://linktr.ee/brandonamrgich">
                        <img
                            className="border border-secondary-light aspect-square shadow-lg rounded-full "
                            src={profilePicture}
                            alt="Profile"
                            width="256"
                            height="256"
                        />
                    </a>
                </div>
                <ul className="flex flex-row md:flex-col justify-center gap-4 flex-wrap">
                    <SocialMediaLink
                        href={links.instagram.href}
                        icon={links.instagram.icon}
                        colorClass={links.instagram.colorClass}
                        label={links.instagram.label}
                    />
                    <SocialMediaLink
                        href={links.tiktok.href}
                        icon={links.tiktok.icon}
                        colorClass={links.tiktok.colorClass}
                        label={links.tiktok.label}
                    />
                    <SocialMediaLink
                        href={links.youtube.href}
                        icon={links.youtube.icon}
                        colorClass={links.youtube.colorClass}
                        label={links.youtube.label}
                    />
                </ul>
            </div>

            <section className="text-center mb-8">
                <p className="text-lg text-secondary-dark mb-4">
                    Brandon is a multi-instrumentalist based out of Florida, with a lifelong passion
                    for music. From a young age, his fascination with sound has driven him to
                    explore and create. On March 1st 2024, along with
                    <a
                        className="text-accent-DEFAULT hover:text-accent-dark font-light"
                        href={contentLinks.artistBlueshades.link}
                    >
                        <span> {contentLinks.artistBlueshades.text}, </span>
                    </a>
                    they released the collaborative project
                    <a
                        className="text-accent-DEFAULT hover:text-accent-dark font-light"
                        href={contentLinks.albumGota.link}
                    >
                        <span> {contentLinks.albumGota.text}. </span>
                    </a>
                    This album consists of four live performances in an eerily empty auditorium.
                    Equipped with Brandon's H1N field recording mic, piano, Blueshades synth,
                    looper, and vocals, they managed to create an atmosphere filled with an
                    undeniable "in-the-moment" feeling.
                </p>
            </section>
        </div>
    );
};
export default About;
