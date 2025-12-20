import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';
import { useAudio } from '../../contexts/AudioContext';
import { useAdmin } from '../../contexts/AdminContext';
import { ARTISTS } from '../../projects/artistData';
import ArtistSocialLinks from './ArtistSocialLinks';
import CompressedAudioGrid from '../AudioPlayer/CompressedAudioGrid';
import TrackUploadForm from '../TrackUploadForm';

const overlayVariants = {
	hidden: { opacity: 0 },
	show: { opacity: 1 },
	exit: { opacity: 0 },
};

const contentVariants = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 8 },
};

const ProjectView = () => {
	const { activeProject, isProjectOpen, closeProject } = useProjects();
	const { tracksByType, tracksLoading } = useAudio();
	const { isAdmin } = useAdmin();
	const artistId = activeProject?.artistId || activeProject?.id;
	const artist = artistId ? ARTISTS[artistId] : null;
	const artistBucketKey = artistId ? `ARTIST_${String(artistId).toUpperCase().replace(/-/g, '_')}` : null;
	const artistTracks = (artistBucketKey && tracksByType && tracksByType[artistBucketKey]) ? tracksByType[artistBucketKey] : [];
	const [showUpload, setShowUpload] = useState(false);
	// Resolve banner/profile from project images (object form preferred)
	const resolveImage = (key) => {
		const imgs = activeProject?.images;
		if (imgs && typeof imgs === 'object' && !Array.isArray(imgs) && imgs[key]) return imgs[key];
		if (Array.isArray(imgs)) {
			if (key === 'banner') return imgs[1] || imgs[0];
			if (key === 'profile') return imgs[0];
		}
		return undefined;
	};
	const bannerUrl = resolveImage('banner');
	const profileUrl = resolveImage('profile');
	const bannerFocusY = (activeProject?.images && activeProject.images.bannerFocusY) ? activeProject.images.bannerFocusY : 50;

	// Close on Escape key (desktop)
	useEffect(() => {
		if (!isProjectOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' || e.key === 'Esc') {
				// If the upload modal is open, close it first
				if (showUpload) {
					setShowUpload(false);
					return;
				}
				closeProject();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isProjectOpen, closeProject, showUpload]);
	return (
		<AnimatePresence>
			{isProjectOpen && activeProject && (
				<motion.div
					className="fixed inset-0 z-40 flex items-stretch justify-stretch"
					initial="hidden"
					animate="show"
					exit="exit"
					variants={overlayVariants}
				>
					{/* Backdrop */}
					<motion.div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						aria-hidden="true"
						onClick={closeProject}
						variants={overlayVariants}
					/>

					{/* Shared layout container */}
					<div className="relative z-10 w-full h-full p-3 sm:p-6 md:p-10">
						<motion.div
							layoutId={`card-${activeProject.id}`}
							className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
							style={{
								backgroundImage: `linear-gradient(135deg, ${activeProject.theme.bgFrom}, ${activeProject.theme.bgTo})`,
							}}
						>
							<div className="absolute inset-0 bg-black/30" />
							<div className="relative h-full flex flex-col overflow-y-auto min-h-0">
								{/* Top Bar */}
								<div className="flex items-center justify-between p-4 md:p-6">
									<motion.h3
										className="text-white text-xl md:text-2xl font-semibold"
										layoutId={`title-${activeProject.id}`}
									>
										{artist?.name || activeProject.name}
									</motion.h3>
									<button
										onClick={closeProject}
										className="rounded-full px-3 py-1 text-sm font-medium"
										style={{ backgroundColor: activeProject.theme.accent, color: activeProject.theme.textOnAccent }}
										aria-label="Close project view"
									>
										Close
									</button>
								</div>

								{/* Hero Banner (thin) */}
								<div className="px-4 md:px-6">
									<motion.div
										layoutId={`image-${activeProject.id}`}
										className="relative w-full overflow-hidden rounded-xl bg-black/20 h-[28vh] md:h-[32vh]"
									>
										<img
											src={bannerUrl}
											alt={`${artist?.name || activeProject.name} banner`}
											className="w-full h-full object-cover"
											loading="lazy"
											decoding="async"
											style={{ objectPosition: `center ${bannerFocusY}%` }}
										/>
									</motion.div>
								</div>

								{/* Body */}
								<motion.div
									className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-3 md:mt-4"
									variants={contentVariants}
									initial="hidden"
									animate="show"
									exit="exit"
									transition={{ delay: 0.05 }}
								>
									<div className="md:col-span-2">
										{/* Tagline from project */}
										<motion.p className="text-white/90 text-base md:text-lg" layoutId={`tagline-${activeProject.id}`}>
											{activeProject.tagline}
										</motion.p>
										{/* Artist Bio */}
										<motion.div
											className="mt-4 max-w-[600px] text-white/90 font-serif leading-relaxed"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 6 }}
											transition={{ duration: 0.2 }}
										>
											{artist?.bio && <p className="text-base md:text-lg">{artist.bio}</p>}
										</motion.div>
									</div>
									{/* Profile + Social Links */}
									<div className="md:col-span-1">
										<div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
											<div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto ring-2 ring-white/30">
												<img
													src={profileUrl}
													alt={`${artist?.name || activeProject.name} profile`}
													className="w-full h-full object-cover object-center"
													loading="lazy"
													decoding="async"
													width="128"
													height="128"
												/>
											</div>
											<h4 className="text-white/90 font-semibold mb-3">Find {artist?.name || activeProject.name}</h4>
											<ArtistSocialLinks artistId={artistId} />
										</div>
									</div>
								</motion.div>

								{/* Artist Tracks */}
								<div className="px-4 md:px-6 pb-8">
									<div className="rounded-xl p-4 md:p-5 border border-white/10" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
										<div className="flex items-end justify-between gap-4">
											<div className="flex items-center gap-2">
												<h4 className="text-white/90 font-semibold text-lg">Tracks</h4>
												{isAdmin && artistBucketKey && (
													<button
														onClick={() => setShowUpload(true)}
														title="Add track"
														className="text-2xl leading-none text-white/90 hover:text-white"
														aria-label="Add track"
													>
														+
													</button>
												)}
											</div>
											{artistBucketKey && (
												<span className="text-xs text-white/50 font-mono">{artistBucketKey}</span>
											)}
										</div>
										<div className="mt-4">
											{tracksLoading ? (
												<p className="text-white/70">Loading tracks…</p>
											) : artistTracks && artistTracks.length > 0 ? (
												<CompressedAudioGrid tracks={artistTracks} />
											) : (
												<p className="text-white/70">No tracks yet.</p>
											)}
										</div>
									</div>
								</div>

								{/* Upload Modal (admin only) */}
								{showUpload && isAdmin && artistBucketKey && (
									<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
										<div className="relative">
											<button
												onClick={() => setShowUpload(false)}
												className="absolute -top-4 -right-4 text-gray-300 bg-black/60 rounded-full p-2 hover:text-white hover:bg-black/80 z-10"
												aria-label="Close upload"
											>
												&times;
											</button>
											<TrackUploadForm
												type={artistBucketKey}
												onSuccess={() => setShowUpload(false)}
												defaults={{ artist: artist?.name || activeProject.name }}
											/>
										</div>
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProjectView;


