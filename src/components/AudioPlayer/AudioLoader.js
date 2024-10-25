import defaultTracks from './defaultTracklist.json';

// TODO: Remove after API postman checks
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

        return tracks.map((track) => ({
            ...track,
            id: track.id || `${trackType}-${track.filename}`,
            src: track.src ? `/audio/${trackType}/${track.src}` : null,
            before: track.before ? `/audio/${trackType}/${track.before}` : null,
            after: track.after ? `/audio/${trackType}/${track.after}` : null,
            links: track.links ? `/audio/${trackType}/${track.links}` : null,
        }));
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
