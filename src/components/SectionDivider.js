import React from 'react';

const wavePaths = [
  // Variant 1
  "M0,40 C360,120 1080,-40 1440,60 L1440,100 L0,100 Z",
  // Variant 2 (slightly different wave)
  "M0,60 C480,0 960,120 1440,40 L1440,100 L0,100 Z"
];

const SectionDivider = ({ className = '', flip = false, variant = 0 }) => (
  <div
    className={`w-full overflow-hidden leading-none ${className}`}
    style={{ lineHeight: 0, transform: flip ? 'scaleY(-1)' : undefined }}
  >
    <svg
      viewBox="0 0 1440 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-16 md:h-24"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(44,44,54,0.5)" />
          <stop offset="80%" stopColor="rgba(44,44,54,0.3)" />
          <stop offset="100%" stopColor="rgba(44,44,54,0)" />
        </linearGradient>
      </defs>
      <path
        d={wavePaths[variant % wavePaths.length]}
        fill="url(#waveGradient)"
        style={{ filter: 'blur(2px)' }}
      />
    </svg>
  </div>
);

export default SectionDivider; 