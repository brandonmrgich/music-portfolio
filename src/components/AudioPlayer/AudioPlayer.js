import React from "react";
import ABCAudioPlayer from "./ABCAudioPlayer";

class AudioPlayer extends ABCAudioPlayer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            likes: 0,
            hasLiked: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        const likedTracks = JSON.parse(
            localStorage.getItem("likedTracks") || "{}",
        );
        this.setState({
            hasLiked: likedTracks[this.props.title] || false,
            likes: likedTracks[this.props.title] ? 1 : 0,
        });
    }

    handleLike = () => {
        if (!this.state.hasLiked) {
            const likedTracks = JSON.parse(
                localStorage.getItem("likedTracks") || "{}",
            );
            likedTracks[this.props.title] = true;
            localStorage.setItem("likedTracks", JSON.stringify(likedTracks));
            this.setState({ hasLiked: true, likes: 1 });
        }
    };

    renderAdditionalControls() {
        const { likes, hasLiked } = this.state;
        return (
            <button
                onClick={this.handleLike}
                disabled={hasLiked}
                className="bg-gray-300 px-3 py-1 rounded"
            >
                Like ({likes})
            </button>
        );
    }
}

export default AudioPlayer;
