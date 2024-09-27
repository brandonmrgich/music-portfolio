import defaultTracks from "./defaultTracklist.json";

// TODO: Remove after API postman checks
const publicPath = process.env.PUBLIC_URL;

class AudioLoader {
    constructor() {
        this.defaultTrackData = defaultTracks;
    }
    static trackTypes = {
        "wip": defaultTracks.WIP,
        "scoring": defaultTracks.SCORING,
        "reel": defaultTracks.REEL,
    };

    static async getLocalTracks(trackType = "wip") {
        console.debug("AudioLoader::getLocalTracks():", { trackType });

        const tracks = this.trackTypes[trackType.toLowerCase()] || this.trackTypes["wip"];
        //const tracks = trackType.toLowerCase() === "comparison" ? defaultTracks.SCORING : defaultTracks.WIP;

        console.debug("AudioLoader::getLocalTracks():", { tracks });
        console.debug("Local tracks JSON had this: ", tracks);

        return tracks.map((track) => ({
            ...track,
            id: track.id || `${trackType}-${track.filename}`,
            src: track.src ? `/audio/${trackType}/${track.src}` : null,
            beforeSrc: track.beforeSrc ? `/audio/${trackType}/${track.beforeSrc}` : null,
            afterSrc: track.afterSrc ? `/audio/${trackType}/${track.afterSrc}` : null,
        }));
    }

    static async getAPITracks(trackType = "wip") {
        try {
            const response = await fetch(`/api/audio/${trackType}`);
            if (!response.ok) {
                throw new Error("Failed to fetch audio files from API");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching API tracks:", error);
            return [];
        }
    }

    static async getAllTracks(trackType = "wip") {
        const [localTracks, apiTracks] = await Promise.all([
            this.getLocalTracks(trackType),
            this.getAPITracks(trackType),
        ]);

        return [...localTracks, ...apiTracks];
    }
}

export default AudioLoader;
