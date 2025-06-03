import AudioGrid, { renderAudioGrid } from './AudioPlayer/AudioGrid';
import { useAudio } from '../contexts/AudioContext';
import { useEffect } from 'react';

/**
 * InWork - Page for displaying work-in-progress tracks.
 * Uses AudioContext for track data and error/loading state.
 * @param {object} props
 * @param {boolean} props.isAdmin - If true, show admin features (unused here)
 * @returns {JSX.Element}
 */
const InWork = ({ isAdmin }) => {
    const { tracks, tracksLoading, tracksError } = useAudio();
    const isComparison = false;
    const error = tracksError;
    const isLoading = tracksLoading;

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    return (
        <div className="in-work p-4 sm:p-6 max-w-4xl mx-auto space-y-12">
            <p className="text-lg text-text-light dark:text-text-dark mb-4 text-center">
                Here are some songs and demos I'm currently working on:
            </p>
            {renderAudioGrid(tracks.wip, isComparison, isLoading)}
        </div>
    );
};

export default InWork;
