import React, { useState, useEffect } from "react";
import defaultPfp from "../pictures/profile-default.jpg";
import getRandomProfilePicture from "../utils/getRandomProfilePicture";
import { SocialMediaLink, Links } from "./SocialMediaLink";

/**
 * About page component.
 * @returns {React.Component} The About page component
 */
const About = ({ isAdmin }) => {
    const [profilePicture, setProfilePicture] = useState(defaultPfp);
    const links = Links.Social;

    useEffect(() => {
        const randomImage = getRandomProfilePicture();
        setProfilePicture(randomImage);
    }, []);

    return (
        <div className="about p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl font-bold text-center mb-6">
                Brandon Mrgich
            </h1>

            <div className="flex flex-col items-center md:flex-row md:items-start mb-8 flex-wrap">
                <div className="mb-4 md:mb-0 md:mr-8 flex justify-center">
                    <a href="https://linktr.ee/brandonamrgich">
                        <img
                            className="border border-gray-300 aspect-square shadow-lg rounded-full"
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
                <p className="text-lg text-gray-700 mb-4">
                    An enthusiastic multi-instrumentalist based in Florida,
                    Brandon Mrgich has been captivated by the vast world of
                    sound since the age of seven. His relentless curiosity and
                    passion for creation drive an ongoing journey in music
                    composition, leading him to share his work with you. In a
                    significant milestone of his musical career, Brandon Mrgich,
                    in collaboration with Blueshades, has recently released
                    "Ghosts of the Auditorium: Live Performances for an Empty
                    Theatre." Available from March 1, 2024, this album provides
                    an intimate experience of live performances set in an eerily
                    empty auditorium. Over the course of four hour-long
                    sessions, Brandon and Blueshades crafted this spontaneous
                    project, capturing each moment with an H1N field recording
                    mic. The resulting work resonates deeply within the
                    theater's emptiness, creating an atmosphere of profound
                    emotional depth and an unmistakable sense of being present
                    in the moment.{" "}
                </p>
            </section>
        </div>
    );
};

export default About;
