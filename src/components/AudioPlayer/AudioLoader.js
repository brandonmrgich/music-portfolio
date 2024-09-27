import React, { useState, useEffect } from "react";
import defaultTracks from "audio/defaultTracklist.json";

const publicPath = process.env.PUBLIC_URL;
const wip = publicPath + "audio/wip";

class AudioLoader {
    constructor() {
        this.state = {
            error: "",
        };
        fetch("./audio/defaultTracklist.json")
            .then((res) => res.json())
            .then((data) => {
                this.defaultTrackData = data;
            });
    }

    loadAudio(path) {
        // TODO: Check path, load src, default title to src basename, default to type: defaultTrack
    }

    static defaultTracks = defaultTracks.WIP;
    static defaultComparisonTracks = defaultTracks.SCORING;

    static getTracks(trackType = "wip") {
        // if tracks fail return default
        console.log({ publicPath });

        return trackType.toLowerCase === "comparison"
            ? this.defaultComparisonTracks
            : this.defaultTracks;
    }

    lazyLoad() {
        fetch("/api/audio")
            .then((response) => {
                if (!response.ok) {
                    console.error(response.status, ":", response.statusText);
                    setError("Unable to load audio tracks. Please try again later.");
                    throw new Error("Failed to fetch audio files");
                }
                return response.json();
            })
            .then((data) => setTracks(data), setError(""))
            .catch((err) => {
                console.error(err);
                setError("Unable to fetch audio tracks. Please try again later.");
            });
    }
}
export default AudioLoader;
