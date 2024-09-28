import { useState, useEffect } from "react";
import AudioLoader from "./components/AudioPlayer/AudioLoader";

export const useTracks = (trackType = "wip", trackSrc = "local") => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Only sample reel tracks are comparison tracks
    const isComparison = trackType.toLowerCase() === "reel";

    useEffect(() => {
        const loadTracks = async () => {
            try {
                setIsLoading(true);
                let loadedTracks = null;
                console.log("Hooks::useTracks(): trackType: ", { trackType });

                trackSrc.toLowerCase() === "local"
                    ? (loadedTracks = await AudioLoader.getLocalTracks(trackType))
                    : (loadedTracks = await AudioLoader.getApiTracks(trackType));

                setTracks(...tracks, loadedTracks);
                setError(null);
            } catch (err) {
                console.error("Error loading tracks:", err);
                setError("Failed to load audio tracks. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTracks();
    }, [trackType]);

    console.log("Hooks::useTracks(): Returning tracks:", { tracks });
    return { tracks, isLoading, error, isComparison };
};
