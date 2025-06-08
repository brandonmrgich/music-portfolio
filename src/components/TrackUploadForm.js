import React, { useState, useRef } from 'react';
import { addTrack } from '../services/tracks';
import { useAudio } from '../contexts/AudioContext';

/**
 * Modular upload form for WIP, SCORING, and REEL tracks.
 * @param {string} type - 'WIP', 'SCORING', or 'REEL'
 * @param {function} onSuccess - called after successful upload
 * @param {object} defaults - { title, artist }
 */
const accent = 'bg-accent-dark text-white';
const border = 'border border-border-dark';
const rounded = 'rounded-lg';
const dropBase = `flex flex-col items-center justify-center p-3 cursor-pointer transition-colors duration-200 ${border} ${rounded} bg-card-dark hover:bg-accent-dark/10`;
const dropActive = 'bg-accent-dark/20 border-accent-light';

const TrackUploadForm = ({ type, onSuccess, defaults = {} }) => {
  const [title, setTitle] = useState(defaults.title || '');
  const [artist, setArtist] = useState(defaults.artist || 'Brandon Mrgich');
  const [file, setFile] = useState(null); // for WIP/SCORING
  const [beforeFile, setBeforeFile] = useState(null); // for REEL
  const [afterFile, setAfterFile] = useState(null); // for REEL
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState({ before: false, after: false, single: false });
  const { refreshTracks } = useAudio();
  const beforeInputRef = useRef();
  const afterInputRef = useRef();
  const singleInputRef = useRef();

  // Drag and drop handlers
  const handleDrag = (e, which) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [which]: true }));
  };
  const handleDragLeave = (e, which) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [which]: false }));
  };
  const handleDrop = (e, which) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [which]: false }));
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    if (which === 'before') setBeforeFile(droppedFile);
    else if (which === 'after') setAfterFile(droppedFile);
    else setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleBeforeChange = (e) => {
    setBeforeFile(e.target.files[0]);
  };
  const handleAfterChange = (e) => {
    setAfterFile(e.target.files[0]);
  };

  const clearFile = (which) => {
    if (which === 'before') setBeforeFile(null);
    else if (which === 'after') setAfterFile(null);
    else setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !artist) {
      setError('Title and artist are required');
      return;
    }
    if (type === 'REEL') {
      if (!beforeFile || !afterFile) {
        setError('Please select both before and after audio files');
        return;
      }
    } else {
      if (!file) {
        setError('Please select an audio file');
        return;
      }
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('links', JSON.stringify({})); // Placeholder for links
      if (type === 'REEL') {
        formData.append('file', beforeFile);
        formData.append('file', afterFile);
      } else {
        formData.append('file', file);
      }
      await addTrack(formData);
      await refreshTracks();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to upload track.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-xs mx-auto px-4 py-5 bg-card-dark border border-border-dark shadow-lg rounded-xl"
    >
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border border-border-dark bg-surface-dark text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-accent-dark"
      />
      <input
        type="text"
        value={artist}
        onChange={e => setArtist(e.target.value)}
        placeholder="Artist"
        className="w-full p-2 border border-border-dark bg-surface-dark text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-accent-dark"
      />
      {type === 'REEL' ? (
        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-xs font-medium mb-1 text-white">Before (original)</label>
            <div
              className={`${dropBase} ${dragActive.before ? dropActive : ''}`}
              onDragOver={e => handleDrag(e, 'before')}
              onDragEnter={e => handleDrag(e, 'before')}
              onDragLeave={e => handleDragLeave(e, 'before')}
              onDrop={e => handleDrop(e, 'before')}
              onClick={() => beforeInputRef.current.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload before audio file"
            >
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={beforeInputRef}
                onChange={handleBeforeChange}
              />
              {beforeFile ? (
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-xs text-white">{beforeFile.name}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); clearFile('before'); }} className="text-red-400 hover:text-red-600 ml-2">&times;</button>
                </div>
              ) : (
                <span className="text-white/60">Drag & drop or click to select file</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-white">After (processed)</label>
            <div
              className={`${dropBase} ${dragActive.after ? dropActive : ''}`}
              onDragOver={e => handleDrag(e, 'after')}
              onDragEnter={e => handleDrag(e, 'after')}
              onDragLeave={e => handleDragLeave(e, 'after')}
              onDrop={e => handleDrop(e, 'after')}
              onClick={() => afterInputRef.current.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload after audio file"
            >
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={afterInputRef}
                onChange={handleAfterChange}
              />
              {afterFile ? (
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-xs text-white">{afterFile.name}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); clearFile('after'); }} className="text-red-400 hover:text-red-600 ml-2">&times;</button>
                </div>
              ) : (
                <span className="text-white/60">Drag & drop or click to select file</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Audio File</label>
          <div
            className={`${dropBase} ${dragActive.single ? dropActive : ''}`}
            onDragOver={e => handleDrag(e, 'single')}
            onDragEnter={e => handleDrag(e, 'single')}
            onDragLeave={e => handleDragLeave(e, 'single')}
            onDrop={e => handleDrop(e, 'single')}
            onClick={() => singleInputRef.current.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload audio file"
          >
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              ref={singleInputRef}
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex items-center gap-2">
                <span className="truncate max-w-xs text-white">{file.name}</span>
                <button type="button" onClick={e => { e.stopPropagation(); clearFile('single'); }} className="text-red-400 hover:text-red-600 ml-2">&times;</button>
              </div>
            ) : (
              <span className="text-white/60">Drag & drop or click to select file</span>
            )}
          </div>
        </div>
      )}
      <button
        type="submit"
        className={`w-full p-2 mt-2 ${accent} ${rounded} hover:bg-accent-dark/90 transition-colors duration-200 text-base`}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="text-red-400 text-xs text-center mt-2">{error}</div>}
    </form>
  );
};

export default TrackUploadForm; 