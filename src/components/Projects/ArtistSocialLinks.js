import React from 'react';
import { SocialMediaLink } from '../SocialMediaLink';
import { ARTISTS } from '../../projects/artistData';
import {
	FaInstagram,
	FaSpotify,
	FaYoutube,
	FaApple,
	FaBandcamp,
	FaSoundcloud,
	FaGlobe,
} from 'react-icons/fa';

// Map platform key -> icon component + display label + brand color if needed
const PLATFORM_MAP = {
	instagram: { icon: FaInstagram, label: 'Instagram' },
	spotify: { icon: FaSpotify, label: 'Spotify' },
	youtube: { icon: FaYoutube, label: 'YouTube' },
	apple: { icon: FaApple, label: 'Apple Music' },
	bandcamp: { icon: FaBandcamp, label: 'Bandcamp' },
	soundcloud: { icon: FaSoundcloud, label: 'SoundCloud' },
	website: { icon: FaGlobe, label: 'Website' },
};

/**
 * Renders a row/wrapping grid of social links for an artist.
 * - Accepts artistId or a direct links object
 * - Falls back to an empty list when no links are found
 */
const ArtistSocialLinks = ({ artistId, links }) => {
	const finalLinks = links || (artistId ? ARTISTS[artistId]?.links : null) || {};
	const entries = Object.entries(finalLinks);
	if (!entries.length) return null;

	return (
		<ul className="flex flex-row flex-wrap gap-3 md:gap-4 items-center">
			{entries.map(([key, href]) => {
				const config = PLATFORM_MAP[key] || { icon: FaGlobe, label: key };
				return (
					<SocialMediaLink
						key={key}
						href={href}
						icon={config.icon}
						label={config.label}
					/>
				);
			})}
		</ul>
	);
};

export default ArtistSocialLinks;


