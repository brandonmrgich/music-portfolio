// Centralized project metadata used by the Project Selector and View
// Per-project images; replace with your own later as needed.
import brandonProfile from '../assets/images/brandon-mrgich/profile.jpeg';
import brandonBanner from '../assets/images/brandon-mrgich/banner.png';
import lakaProfile from '../assets/images/laka-noch/profile.jpg';
import lakaBanner from '../assets/images/laka-noch/banner.png';
import serProfile from '../assets/images/serendipitous/profile.png';
import serBanner from '../assets/images/serendipitous/banner.jpg';

// Temporarily hidden project: ROENAN (keep assets around for easy re-enable)
// import roeProfile from '../assets/images/serendipitous/banner.jpg';
// import roeBanner from '../assets/images/serendipitous/banner.jpg';

export const PROJECTS = [
    {
        id: 'brandon-mrgich',
        artistId: 'brandon-mrgich',
        name: 'Brandon Mrgich',
        tagline: 'Ambient Electronic, Neo-Classical, Film & Game',
        theme: {
            bgFrom: '#0f172a', // slate-900
            bgTo: '#1e293b', // slate-800
            accent: '#38bdf8', // sky-400
            textOnAccent: '#020617', // slate-950
        },
        images: {
            profile: brandonProfile,
            banner: brandonBanner,
            // Controls vertical crop of the banner image (object-position: center <value>%)
            // Increase to shift focus lower; decrease to shift focus higher.
            bannerFocusY: 45,
            covers: [],
        },
    },
    {
        id: 'laka-noch',
        artistId: 'laka-noch',
        name: 'Laka Noch',
        tagline: 'Folktronic, Alternative, Singer-Songwriter',
        theme: {
            bgFrom: '#111827', // gray-900
            bgTo: '#064e3b', // emerald-900
            accent: '#34d399', // emerald-400
            textOnAccent: '#052e2b',
        },
        images: {
            profile: lakaProfile,
            banner: lakaBanner,
            bannerFocusY: 35,
            covers: [],
        },
    },
    {
        id: 'serendipitous',
        artistId: 'serendipitous',
        name: 'Serendipitous',
        tagline: 'House, Indie pop, Drum&Bass, Downtempo',
        theme: {
            bgFrom: '#0b1020', // deep custom
            bgTo: '#1f2937', // gray-800
            accent: '#a78bfa', // violet-400
            textOnAccent: '#0a0620',
        },
        images: {
            profile: serProfile,
            banner: serBanner,
            bannerFocusY: 0,
            covers: [],
        },
    },
    // {
    //     id: 'roenan',
    //     artistId: 'roenan',
    //     name: 'RØENAN',
    //     tagline: 'Folk, Singer-Songwriter',
    //     theme: {
    //         bgFrom: '#0f172a', // slate-900
    //         bgTo: '#1e293b', // slate-800
    //         accent: '#38bdf8', // sky-400
    //         textOnAccent: '#020617', // slate-950
    //     },
    //     images: {
    //         profile: roeProfile,
    //         banner: roeBanner,
    //         // Controls vertical crop of the banner image (object-position: center <value>%)
    //         // Increase to shift focus lower; decrease to shift focus higher.
    //         bannerFocusY: 45,
    //         covers: [],
    //     },
    // },
];

export function getProjectById(projectId) {
    return PROJECTS.find((p) => p.id === projectId) || null;
}
