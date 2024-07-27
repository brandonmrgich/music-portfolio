import React, { useState, useEffect } from "react";
import defaultPfp from "../pictures/profile-default.jpg";
import getRandomProfilePicture from "../utils/getRandomProfilePicture";
import "../styles/styles.css";

/**
 * About page component.
 * @returns {React.Component} The About page component
 */
const About = ({ isAdmin }) => {
    const [profilePicture, setProfilePicture] = useState({ defaultPfp });

    useEffect(() => {
        const randomImage = getRandomProfilePicture();
        setProfilePicture(randomImage);
    }, []);

    return (
        <div className="about p-6">
            <h1 className="text-3xl font-bold mb-6">About me</h1>

            <div className="profile-container mb-4">
                <div className="profile-picture">
                    {/* Add an img tag here when you have a profile picture */}
                    <a href="https://linktr.ee/brandonamrgich">
                        <img
                            className="border border-x-black aspect-square shadow-md shadow-black"
                            src={profilePicture}
                            height="256"
                            width="256"
                            alt="no work... :((( "
                        />
                    </a>
                </div>
                <ul className="profile-links mb-4 font-semibold">
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-2 rounded transition">
                        <a href="https://instagram.com/brandonmrgichmusic">
                            Instagram
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-2 rounded transition">
                        <a href="https://www.tiktok.com/@brandonmrgichmusic">
                            TikTok
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-2 rounded transition">
                        <a href="https://www.youtube.com/channel/UCa9sV72a1B3jijmSKN9cX4A">
                            Youtube
                        </a>
                    </li>
                </ul>
            </div>

            <section className="bio-section mb-8">
                <h2 className="text-xl font-semibold mb-4">Brandon Mrgich</h2>
                <p className="mb-4">
                    Multi-instrumentalist based in Florida simply exploring the
                    massive world of sound. Attracted to music and sound since
                    the age of 7, the sense of curiosity and desire to create
                    fuels a never-ending journey of music composition.
                </p>
            </section>

            <section className="links-section mb-8">
                <h2 className="text-2xl font-semibold mb-4">Streaming links</h2>
                <ul className="links mb-4 font-semibold row-list border border-black">
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://open.spotify.com/artist/7h7WBTx9dIcxxPXLbPUu0e?si=FsICdE5uQIWib3cXcjxr5w&dl_branch=1">
                            Spotify
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://music.youtube.com/channel/UChyoiJlsGvzE5sj0c-PTADA">
                            Youtube Music
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://music.apple.com/us/artist/brandon-mrgich/1516929028">
                            Apple Music
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://music.amazon.com/artists/B089Q1C8S2/brandon-mrgich?marketplaceId=ATVPDKIKX0DER&musicTerritory=US">
                            Amazon Music
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://brandonmrgich.bandcamp.com/">
                            Bandcamp
                        </a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://audius.co/brandonmrgich">Audius</a>
                    </li>
                    <li className="text-blue-800 hover:text-blue-300 hover:bg-link p-1 rounded transition">
                        <a href="https://soundcloud.com/user-36814317">
                            Soundcloud
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default About;
