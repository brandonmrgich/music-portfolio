import AudioGrid, { renderAudioGrid } from './AudioPlayer/AudioGrid';
import { useEffect, useState } from 'react';
import { useTracks } from '../hooks/UseTracks';

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 *
 */
const InWork = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks('wip');

    useEffect(() => {
        if (error) console.error(error);
    }, [tracks]);

    return (
        <div className="in-work p-4 sm:p-6 max-w-4xl mx-auto space-y-12">
            <p className="text-lg text-gray-700 mb-4 text-center">
                Here are some songs and demos I'm currently working on:
            </p>
            {renderAudioGrid(tracks, isComparison, isLoading)}
        </div>
    );
};

export default InWork;
