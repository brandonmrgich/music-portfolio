import React, { useState, useEffect } from "react";

class AudioLoader {
    defaultTrack = {
        id: 1,
        title: "Placeholder Song 1",
        src: "",
    };

    getTracks() {
        // if tracks fail return default
        return this.defaultTrack;
    }

    //    constructor(props) {
    //        super(props);
    //        this.state = {};
    //    }
}

export default AudioLoader;
