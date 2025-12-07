import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProjects } from '../../contexts/ProjectContext';

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
							<div className="relative h-full flex flex-col">
								{/* Top Bar */}
								<div className="flex items-center justify-between p-4 md:p-6">
									<motion.h3
										className="text-white text-xl md:text-2xl font-semibold"
										layoutId={`title-${activeProject.id}`}
									>
										{activeProject.name}
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

								{/* Hero Media */}
								<div className="px-4 md:px-6">
									<motion.div layoutId={`image-${activeProject.id}`} className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-black/20">
										<img
											src={activeProject.images?.[1] || activeProject.images?.[0]}
											alt={`${activeProject.name} cover large`}
											className="w-full h-full object-cover"
										/>
									</motion.div>
								</div>

								{/* Body */}
								<motion.div
									className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-2 md:mt-4"
									variants={contentVariants}
									initial="hidden"
									animate="show"
									exit="exit"
									transition={{ delay: 0.05 }}
								>
									<div className="md:col-span-2">
										<motion.p
											className="text-white/90 text-base md:text-lg"
											layoutId={`tagline-${activeProject.id}`}
										>
											{activeProject.tagline}
										</motion.p>
										<div className="mt-4 space-y-3 text-white/80 text-sm leading-relaxed">
											<p>
												This is a placeholder project page. Replace this area with tracks, videos, or case
												studies relevant to <span className="font-semibold">{activeProject.name}</span>.
											</p>
											<p>
												The transition uses Framer Motion shared layoutId to morph the selected card into this
												full view. The background, image, and title are smoothly animated for an immersive feel.
											</p>
										</div>
									</div>
									<div className="md:col-span-1">
										<div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
											<h4 className="text-white/90 font-semibold mb-2">Highlights</h4>
											<ul className="text-white/80 text-sm space-y-2 list-disc list-inside">
												<li>Smooth shared-layout transitions</li>
												<li>SPA friendly overlay</li>
												<li>Tailwind + Framer Motion</li>
											</ul>
										</div>
									</div>
								</motion.div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProjectView;


