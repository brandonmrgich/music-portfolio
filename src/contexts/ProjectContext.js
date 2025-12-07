import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { getProjectById } from '../projects/PROJECTS';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
	const [activeProjectId, setActiveProjectId] = useState(null);

	const openProject = useCallback((projectId) => {
		setActiveProjectId(projectId);
		// Lock page scroll when project is open
		document.body.style.overflow = 'hidden';
	}, []);

	const closeProject = useCallback(() => {
		setActiveProjectId(null);
		document.body.style.overflow = '';
	}, []);

	const value = useMemo(() => {
		return {
			activeProjectId,
			activeProject: activeProjectId ? getProjectById(activeProjectId) : null,
			openProject,
			closeProject,
			isProjectOpen: Boolean(activeProjectId),
			setActiveProjectId,
		};
	}, [activeProjectId, openProject, closeProject]);

	return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
	const ctx = useContext(ProjectContext);
	if (!ctx) {
		throw new Error('useProjects must be used within a ProjectProvider');
	}
	return ctx;
};


