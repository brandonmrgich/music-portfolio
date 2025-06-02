import defaultTracks from './defaultTracklist.json';
import { fileExists } from '../../utils/FileExists';

const publicPath = process.env.PUBLIC_URL;

/**
 * AudioLoader - Utility class for loading local and API audio tracks.
 * Used for validating and formatting track data.
 */
class AudioLoader {
    constructor() {
        this.defaultTrackData = defaultTracks;
    }

    /**
     * Track types mapped to default track data.
     */
    static trackTypes = {
        wip: defaultTracks.WIP,
        scoring: defaultTracks.SCORING,
        reel: defaultTracks.REEL,
    };

    /**
     * Get local tracks for a given type, validating file existence.
     * @param {string} trackType
     * @returns {Promise<Array>}
     */
    static async getLocalTracks(trackType = 'wip') {
        const tracks = this.trackTypes[trackType.toLowerCase()];
        const validTracks = [];

        for (const track of tracks) {
            const basePath = `audio/${trackType}/`;
            const srcExists = track.src && (await fileExists(`${basePath}${track.src}`));
            const beforeExists = track.before && (await fileExists(`${basePath}${track.before}`));
            const afterExists = track.after && (await fileExists(`${basePath}${track.after}`));

            if (
                (trackType == 'reel' && !beforeExists && !afterExists) ||
                (trackType != 'reel' && !srcExists)
            ) {
                continue;
            }

            validTracks.push({
                ...track,
                id: track.id || `${trackType}-${track.filename}`,
                // TODO: src doesnt exist, default to the before track. Later if data is malformed
                // and only one of the before/after files exist, this will break
                src: track.src ? `/${basePath}${track.src}` : `/${basePath}${track.before}`,
                before: track.before ? `/${basePath}${track.before}` : null,
                after: track.after ? `/${basePath}${track.after}` : null,
                links: track.links ? `/${basePath}${track.links}` : null,
            });
        }

        return validTracks;
    }

    /**
     * (Commented out) Example for fetching tracks from an API endpoint.
     * @param {string} trackType
     * @returns {Promise<Array>}
     */
    // static async getAPITracks(trackType = 'wip') {
    //     try {
    //         const response = await fetch(`/api/audio/${trackType}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch audio files from API');
    //         }
    //         return await response.json();
    //     } catch (error) {
    //         console.error('Error fetching API tracks:', error);
    //         return [];
    //     }
    // }

    /**
     * Get all tracks for a given type from both local and API sources.
     * @param {string} trackType
     * @returns {Promise<Array>}
     */
    static async getAllTracks(trackType = 'wip') {
        const [localTracks, apiTracks] = await Promise.all([
            this.getLocalTracks(trackType),
            this.getAPITracks(trackType),
        ]);
        return [...localTracks, ...apiTracks];
    }
}

export default AudioLoader;
