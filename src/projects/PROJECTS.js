// Centralized project metadata used by the Project Selector and View
// Dummy assets reference existing images; replace with your own later.
import profileDefault from '../assets/images/profile-default.jpg';
import profileCoat from '../assets/images/profile-coat.png';
import profileBeach from '../assets/images/profile-beach.jpeg';

export const PROJECTS = [
	{
		id: 'brandon-mrgich',
		name: 'Brandon Mrgich',
		tagline: 'Composer • Mixer • Producer',
		theme: {
			bgFrom: '#0f172a', // slate-900
			bgTo: '#1e293b', // slate-800
			accent: '#38bdf8', // sky-400
			textOnAccent: '#020617', // slate-950
		},
		images: [profileDefault, profileCoat],
	},
	{
		id: 'laka-noch',
		name: 'Laka Noch',
		tagline: 'Experimental Electronic • Textures',
		theme: {
			bgFrom: '#111827', // gray-900
			bgTo: '#064e3b', // emerald-900
			accent: '#34d399', // emerald-400
			textOnAccent: '#052e2b',
		},
		images: [profileCoat, profileBeach],
	},
	{
		id: 'serendipitous',
		name: 'Serendipitous',
		tagline: 'Ambient • Cinematic • Calm',
		theme: {
			bgFrom: '#0b1020', // deep custom
			bgTo: '#1f2937', // gray-800
			accent: '#a78bfa', // violet-400
			textOnAccent: '#0a0620',
		},
		images: [profileBeach, profileDefault],
	},
];

export function getProjectById(projectId) {
	return PROJECTS.find((p) => p.id === projectId) || null;
}


