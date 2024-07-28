import React, { useState } from "react";
import throwDetailedError from "../utils/error";

const AudioUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.debug("Files set");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload");
            console.error(error);
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("audio", file);

        try {
            const response = await fetch("/api/audio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                console.error(response.statusText);
                throwDetailedError("Fetch error: ");

                throw new Error("Upload failed");
            }

            const data = await response.json();
            console.log("Upload successful:", data);
            setFile(null);
        } catch (err) {
            setError("Failed to upload audio. Please try again later.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="audio-upload">
            <h2>Upload Audio</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AudioUpload;
