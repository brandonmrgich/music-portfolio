import React from 'react';

const SectionDivider = ({ className = '', style = {}, variant = 0 }) => {
  // Subtler, low-opacity gradient for center-strong blur (variant 0)
  const centerGradient =
    'linear-gradient(to bottom, transparent 0%, rgba(35,35,35,0.04) 8%, rgba(35,35,35,0.12) 18%, rgba(35,35,35,0.25) 40%, rgba(35,35,35,0.25) 60%, rgba(35,35,35,0.12) 82%, rgba(35,35,35,0.04) 92%, transparent 100%)';
  // Stronger, extended top-strong blur for variant 1
  const topGradient =
    'linear-gradient(to bottom, rgba(35,35,35,0.25) 0%, rgba(35,35,35,0.12) 30%, transparent 100%)';

  return (
    <div className={`relative w-full h-16 my-0 ${className}`} style={style}>
      {/* Glassy base line with more pronounced shadow */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'rgba(35, 35, 35, 0.18)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          boxShadow: '0 8px 32px 0 rgba(35,35,35,0.28), 0 -8px 32px 0 rgba(35,35,35,0.28)',
          pointerEvents: 'none',
        }}
      />
      {/* Subtle gradient overlay for fade/blur effect */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: variant === 0 ? centerGradient : topGradient,
          filter: variant === 0 ? 'blur(0.5px)' : undefined,
        }}
      />
    </div>
  );
};

export default SectionDivider; 