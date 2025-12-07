import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../projects/PROJECTS';
import { useProjects } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard';

const container = {
	hidden: { opacity: 0, y: 12 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.05,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0 },
};

const ProjectSelector = () => {
	const { openProject } = useProjects();
	return (
		<section className="w-full">
			<div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
				<header className="mb-8 md:mb-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">Projects</h2>
					<p className="mt-2 text-white/80 max-w-2xl mx-auto">
						Select a project to dive in. Smooth shared-layout transitions guide you into each world.
					</p>
				</header>
				<motion.ul
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.2 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
				>
					{PROJECTS.map((project) => (
						<motion.li key={project.id} variants={item} className="min-h-[260px]">
							<ProjectCard project={project} onClick={() => openProject(project.id)} />
						</motion.li>
					))}
				</motion.ul>
			</div>
		</section>
	);
};

export default ProjectSelector;


