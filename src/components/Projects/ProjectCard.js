import React from 'react';
import { motion } from 'framer-motion';

const hoverVariants = {
	initial: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
	hover: { y: -6, boxShadow: '0 15px 35px rgba(0,0,0,0.35)' },
};

const imageVariants = {
	initial: { scale: 1 },
	hover: { scale: 1.05 },
};

const ProjectCard = ({ project, onClick }) => {
	const { id, name, tagline, theme, images } = project;
	const bgStyle = {
		backgroundImage: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
	};

	return (
		<motion.button
			type="button"
			className="w-full h-full text-left rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-black/20"
			onClick={onClick}
			aria-label={`Open ${name}`}
		>
			<motion.div
				layoutId={`card-${id}`}
				variants={hoverVariants}
				initial="initial"
				whileHover="hover"
				className="relative rounded-xl h-full"
				style={bgStyle}
			>
				<div className="absolute inset-0 bg-black/20" />
				<div className="relative p-4 md:p-6 flex flex-col h-full">
					<motion.div
						layoutId={`image-${id}`}
						className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/20"
					>
						<motion.img
							src={images?.[0]}
							alt={`${name} cover`}
							className="w-full h-full object-cover"
							variants={imageVariants}
							transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						/>
					</motion.div>
					<div className="mt-4">
						<motion.h3
							className="text-white font-semibold text-lg md:text-xl"
							layoutId={`title-${id}`}
						>
							{name}
						</motion.h3>
						<motion.p
							className="text-white/80 text-sm md:text-base"
							layoutId={`tagline-${id}`}
						>
							{tagline}
						</motion.p>
					</div>
					<div className="mt-auto pt-4">
						<span
							className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium"
							style={{ backgroundColor: theme.accent, color: theme.textOnAccent }}
						>
							View Project
						</span>
					</div>
				</div>
			</motion.div>
		</motion.button>
	);
};

export default ProjectCard;


