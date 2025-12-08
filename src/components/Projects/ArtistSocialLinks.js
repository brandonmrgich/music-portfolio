import React from 'react';
import { SocialMediaLink } from '../SocialMediaLink';
import { ARTISTS } from '../../projects/artistData';
import {
	FaInstagram,
	FaSpotify,
	FaYoutube,
	FaApple,
		FaAmazon,
	FaBandcamp,
	FaSoundcloud,
	FaGlobe,
	FaTwitter,
	FaTiktok,
} from 'react-icons/fa';
import AudiusIcon from '../icons/AudiusIcon';

// Map platform key -> icon component + display label + brand color if needed
const PLATFORM_MAP = {
	instagram: { icon: FaInstagram, label: 'Instagram' },
	ig: { icon: FaInstagram, label: 'Instagram' },
	spotify: { icon: FaSpotify, label: 'Spotify' },
	youtube: { icon: FaYoutube, label: 'YouTube' },
	yt: { icon: FaYoutube, label: 'YouTube' },
	apple: { icon: FaApple, label: 'Apple Music' },
	applemusic: { icon: FaApple, label: 'Apple Music' },
	itunes: { icon: FaApple, label: 'Apple Music' },
	amazon: { icon: FaAmazon, label: 'Amazon Music' },
	amazonmusic: { icon: FaAmazon, label: 'Amazon Music' },
	prime: { icon: FaAmazon, label: 'Amazon Music' },
	bandcamp: { icon: FaBandcamp, label: 'Bandcamp' },
	soundcloud: { icon: FaSoundcloud, label: 'SoundCloud' },
	website: { icon: FaGlobe, label: 'Website' },
	site: { icon: FaGlobe, label: 'Website' },
	audius: { icon: AudiusIcon, label: 'Audius' },
	tiktok: { icon: FaTiktok, label: 'TikTok' },
	tok: { icon: FaTiktok, label: 'TikTok' },
	twitter: { icon: FaTwitter, label: 'Twitter / X' },
	x: { icon: FaTwitter, label: 'Twitter / X' },
};

const normalizeKey = (key) => {
	if (!key || typeof key !== 'string') return '';
	const lowered = key.toLowerCase();
	// Strip non-letters/digits for robust matching (e.g., 'apple-music', 'you_tube')
	return lowered.replace(/[^a-z0-9]/g, '');
};

const isValidUrl = (href) => {
	if (typeof href !== 'string' || href.length < 4) return false;
	try {
		// Allow protocol-relative or absolute
		const normalized = href.startsWith('http') ? href : `https://${href}`;
		// eslint-disable-next-line no-new
		new URL(normalized);
		return true;
	} catch {
		return false;
	}
};

/**
 * Renders a row/wrapping grid of social links for an artist.
 * - Accepts artistId or a direct links object
 * - Falls back to an empty list when no links are found
 */
const ArtistSocialLinks = ({ artistId, links }) => {
	const finalLinks = links || (artistId ? ARTISTS[artistId]?.links : null) || {};
	const entries = Object.entries(finalLinks)
		.filter(([, href]) => isValidUrl(href))
		.map(([key, href]) => {
			const k = normalizeKey(key);
			return [k in PLATFORM_MAP ? k : key, href];
		});
	if (!entries.length) return null;

	return (
		<ul className="flex flex-row flex-wrap gap-3 md:gap-4 items-center">
			{entries.map(([key, href]) => {
				const normKey = normalizeKey(key);
				const config = PLATFORM_MAP[normKey] || PLATFORM_MAP[key] || { icon: FaGlobe, label: key };
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


