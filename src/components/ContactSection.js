import React from 'react';
import { SocialMediaLink, Links } from './SocialMediaLink';

const contactEmail = 'musicwithmrgich@gmail.com';
const socialKeys = ['instagram', 'tiktok', 'youtube'];

const ContactSection = () => {
	return (
		<section className="relative py-16 px-4 flex flex-col items-center overflow-hidden">
			<div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
				<div className="w-full bg-card-dark/60 backdrop-blur-md border border-border-dark rounded-xl shadow-xl px-5 py-6">
					<h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-6 text-accent-dark text-center">Contact</h2>
					<p className="text-xl md:text-2xl text-text-dark text-center mb-5">
						Reach out for collaborations, mixing/mastering, scoring, or inquiries.
					</p>
					<div className="mb-6 text-center">
						<a
							href={`mailto:${contactEmail}`}
							className="inline-block text-2xl md:text-3xl font-bold text-accent-dark bg-white/10 px-5 py-3 rounded-lg shadow-md hover:bg-accent-dark hover:text-white transition-colors duration-200"
							style={{ letterSpacing: '0.01em' }}
						>
							{contactEmail}
						</a>
					</div>
					<ul className="flex flex-row justify-center gap-4 mt-2 flex-wrap">
						{socialKeys.map((key) => (
							<SocialMediaLink key={Links.Social[key].label} {...Links.Social[key]} />
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;


