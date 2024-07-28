import React from "react";

import {
    FaSpotify,
    FaYoutube,
    FaApple,
    FaInstagram,
    FaTiktok,
    FaAmazon,
    FaBandcamp,
    FaSoundcloud,
} from "react-icons/fa";
import AudiusIcon from "../pictures/audius-icon.jpeg";

const Links = {
    Social: {
        instagram: {
            href: "https://instagram.com/brandonmrgichmusic",
            icon: FaInstagram,
            colorClass: "text-pink-600",
            label: "Instagram",
        },
        tiktok: {
            href: "https://www.tiktok.com/@brandonmrgichmusic",
            icon: FaTiktok,
            colorClass: "text-black",
            label: "Tiktok",
        },
        youtube: {
            href: "https://www.youtube.com/channel/UCa9sV72a1B3jijmSKN9cX4A",
            icon: FaYoutube,
            colorClass: "text-red-600",
            label: "Youtube Channel",
        },
    },
    Streaming: {
        spotify: {
            href: "https://open.spotify.com/artist/7h7WBTx9dIcxxPXLbPUu0e?si=FsICdE5uQIWib3cXcjxr5w&dl_branch=1",
            icon: FaSpotify,
            colorClass: "text-green-500",
            label: "Spotify",
        },
        youtube: {
            href: "https://music.youtube.com/channel/UChyoiJlsGvzE5sj0c-PTADA",
            icon: FaYoutube,
            colorClass: "text-red-500",
            label: "YouTube Music",
        },
        apple: {
            href: "https://music.apple.com/us/artist/brandon-mrgich/1516929028",
            icon: FaApple,
            colorClass: "text-black",
            label: "Apple Music",
        },
        amazon: {
            href: "https://music.amazon.com/artists/B089Q1C8S2/brandon-mrgich?marketplaceId=ATVPDKIKX0DER&musicTerritory=US",
            icon: FaAmazon,
            colorClass: "text-yellow-500",
            label: "Amazon Music",
        },
        bandcamp: {
            href: "https://brandonmrgich.bandcamp.com/",
            icon: FaBandcamp,
            colorClass: "text-blue-600",
            label: "Bandcamp",
        },
        audius: {
            href: "https://audius.co/brandonmrgich",
            icon: () => (
                <img
                    className="text-4xl text-purple-600"
                    src={AudiusIcon}
                    height="32"
                    width="32"
                    alt="Audius"
                    style={{ paddingTop: "3px" }}
                />
            ),
            colorClass: "text-purple-600",
            label: "Audius",
        },
        soundcloud: {
            href: "https://soundcloud.com/user-36814317",
            icon: FaSoundcloud,
            colorClass: "text-orange-500",
            label: "SoundCloud",
        },
    },
};

const SocialMediaLink = ({ href, icon: Icon, colorClass, label }) => {
    return (
        <li className="flex flex-col items-center p-2 rounded-full border border-gray-300 hover:bg-blue-100 transition">
            <a
                className="flex flex-col items-center space-y-1 text-blue-800 hover:text-blue-300"
                href={href}
            >
                <Icon className={`text-3xl ${colorClass}`} />
                <span>{label}</span>
            </a>
        </li>
    );
};

export { SocialMediaLink, Links };
