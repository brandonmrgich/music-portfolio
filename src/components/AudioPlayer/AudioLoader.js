import defaultTracks from './defaultTracklist.json';
import { fileExists } from '../../utils/FileExists';

const publicPath = process.env.PUBLIC_URL;

class AudioLoader {
    constructor() {
        this.defaultTrackData = defaultTracks;
    }

    static trackTypes = {
        wip: defaultTracks.WIP,
        scoring: defaultTracks.SCORING,
        reel: defaultTracks.REEL,
    };

    static async getLocalTracks(trackType = 'wip') {
        const tracks = this.trackTypes[trackType.toLowerCase()];
        const validTracks = [];

        for (const track of tracks) {
            const basePath = `audio/${trackType}/`;

            const srcExists = track.src && (await fileExists(`${basePath}${track.src}`));
            const beforeExists = track.before && (await fileExists(`${basePath}${track.before}`));
            const afterExists = track.after && (await fileExists(`${basePath}${track.after}`));

            // TODO: Fix check for if file exists
            console.log(srcExists);
            console.log(beforeExists);
            console.log(afterExists);

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

    static async getAPITracks(trackType = 'wip') {
        try {
            const response = await fetch(`/api/audio/${trackType}`);
            if (!response.ok) {
                throw new Error('Failed to fetch audio files from API');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching API tracks:', error);
            return [];
        }
    }

    static async getAllTracks(trackType = 'wip') {
        const [localTracks, apiTracks] = await Promise.all([
            this.getLocalTracks(trackType),
            this.getAPITracks(trackType),
        ]);

        return [...localTracks, ...apiTracks];
    }
}

export default AudioLoader;
