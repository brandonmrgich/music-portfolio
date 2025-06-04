import React from "react";

import {
    FaGoogle,
    FaSpotify,
    FaYoutube,
    FaApple,
    FaInstagram,
    FaTiktok,
    FaAmazon,
    FaBandcamp,
    FaSoundcloud,
} from "react-icons/fa";
import AudiusIcon from "./icons/AudiusIcon";

// Trademark brand colors for each platform
const BRAND_COLORS = {
    Google: '#4285F4',
    Spotify: '#1DB954',
    'Youtube Channel': '#FF0000', // YouTube Channel (red)
    'YouTube Music': '#FF0000',      // YouTube Music (white)
    Apple: '#000000',
    Instagram: '#E4405F',
    Tiktok: '#010101',
    Amazon: '#FF9900',
    Bandcamp: '#629AA9',
    SoundCloud: '#FF5500',
    Audius: '#CC47FF', // Audius purple
};

const Links = {
    Social: {
        drive: {
            href: "https://drive.google.com/drive/folders/1hm2CJ6tT-SMXo8PPzm14gXQzQxj5gIEB",
            icon: FaGoogle,
            label: "Google Drive",
        },
        instagram: {
            href: "https://instagram.com/brandonmrgichmusic",
            icon: FaInstagram,
            label: "Instagram",
        },
        tiktok: {
            href: "https://www.tiktok.com/@brandonmrgichmusic",
            icon: FaTiktok,
            label: "Tiktok",
        },
        youtube: {
            href: "https://www.youtube.com/channel/UCa9sV72a1B3jijmSKN9cX4A",
            icon: FaYoutube,
            label: "Youtube Channel",
        },
    },
    Streaming: {
        spotify: {
            href: "https://open.spotify.com/artist/7h7WBTx9dIcxxPXLbPUu0e?si=FsICdE5uQIWib3cXcjxr5w&dl_branch=1",
            icon: FaSpotify,
            label: "Spotify",
        },
        youtube: {
            href: "https://music.youtube.com/channel/UChyoiJlsGvzE5sj0c-PTADA",
            icon: FaYoutube,
            label: "YouTube Music",
        },
        apple: {
            href: "https://music.apple.com/us/artist/brandon-mrgich/1516929028",
            icon: FaApple,
            label: "Apple Music",
        },
        amazon: {
            href: "https://music.amazon.com/artists/B089Q1C8S2/brandon-mrgich?marketplaceId=ATVPDKIKX0DER&musicTerritory=US",
            icon: FaAmazon,
            label: "Amazon Music",
        },
        bandcamp: {
            href: "https://brandonmrgich.bandcamp.com/",
            icon: FaBandcamp,
            label: "Bandcamp",
        },
        audius: {
            href: "https://audius.co/brandonmrgich",
            icon: AudiusIcon,
            label: "Audius",
        },
        soundcloud: {
            href: "https://soundcloud.com/user-36814317",
            icon: FaSoundcloud,
            label: "SoundCloud",
        },
    },
};

// Pastel red for hover
const HOVER_COLOR = '#F7B2AD';

const SocialMediaLink = ({ href, icon: Icon, label }) => {
    // Get the brand color for the icon
    const brandColor = BRAND_COLORS[label] || BRAND_COLORS[label.replace(/ .*/,"")] || '#fff';
    return (
        <li className="group flex flex-col items-center p-2 rounded-full bg-opacity-0 hover:bg-opacity-10 font-thin transition">
            <a
                className="flex flex-col items-center space-y-1 transition-colors"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Icon
                    className="text-3xl max-h-6 transition-colors duration-200"
                    style={{
                        color: brandColor,
                    }}
                />
                <span
                    className="transition-colors duration-200 text-xs font-medium tracking-wide"
                    style={{ color: '#fff' }}
                >
                    {label}
                </span>
                <style>{`
                  .group:hover .text-3xl,
                  .group:hover .transition-colors {
                    color: ${HOVER_COLOR} !important;
                  }
                `}</style>
            </a>
        </li>
    );
};

export { SocialMediaLink, Links };
