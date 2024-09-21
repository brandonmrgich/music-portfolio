import React, { useState, useEffect } from "react";
const publicPath = process.env.PUBLIC_URL;
const wip = publicPath + "/wip";

class AudioLoader {
    loadAudio(path) {
        // TODO: Check path, load src, default title to src basename, default to type: defaultTrack
    }
    static defaultTracks = [
        {
            id: 1,
            title: "Placeholder Song 1",
            src: "path/to/before1.mp3",
        },
        {
            id: 2,
            title: "Placeholder Song 2",
            src: "/path/to/after2.mp3",
        },
        {
            id: 3,
            title: "Placeholder Song 4",
            src: "/path/to/after1.mp3",
        },
        {
            id: 4,
            title: "Placeholder Song 4",
            src: "/path/to/after2.mp3",
        },
    ];

    static defaultComparisonTracks = [
        {
            id: 1,
            title: "Placeholder Song 1",
            beforeSrc: "/path/to/before1.mp3",
            afterSrc: "/path/to/after1.mp3",
        },
        {
            id: 2,
            title: "Placeholder Song 2",
            beforeSrc: "/path/to/before2.mp3",
            afterSrc: "/path/to/after2.mp3",
        },
        {
            id: 3,
            title: "Placeholder Song 4",
            beforeSrc: "/path/to/before1.mp3",
            afterSrc: "/path/to/after1.mp3",
        },
        {
            id: 4,
            title: "Placeholder Song 4",
            beforeSrc: "/path/to/before2.mp3",
            afterSrc: "/path/to/after2.mp3",
        },
    ];

    static getTracks(trackType = "wip") {
        // if tracks fail return default
        return trackType.toLowerCase === "comparison"
            ? this.defaultComparisonTracks
            : this.defaultTracks;
    }

    //    constructor(props) {
    //        super(props);
    //        this.state = {};
    //    }
}

export default AudioLoader;
