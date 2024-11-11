import { useState } from 'react';

const AnimatedLoadingText = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const randomizeStrength = 12;

    return (
        <div className="text-xl font-semibold text-gray-700 flex space-x-1 cursor-default">
            {['L', 'o', 'a', 'd', 'i', 'n', 'g', ' ', 't', 'r', 'a', 'c', 'k', 's', '...'].map(
                (letter, index) => (
                    <span
                        key={index}
                        className="inline-block transition-transform duration-300 ease-in-out p-1 text-comfy-dark hover:text-comfy-light"
                        style={{
                            transformOrigin: 'center',
                            transitionDelay: `${index}ms`,
                            transform:
                                hoveredIndex === index
                                    ? `translate(${Math.random() * randomizeStrength - 4}px, ${Math.random() * randomizeStrength - 4}px) rotate(${Math.random() * (randomizeStrength - 12) - 10}deg)`
                                    : 'translate(0, 0) rotate(0)',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <h3
                            className="m-1 font-semibold animate-bounce"
                            style={{
                                animationDelay: `${index * 30}ms`,
                            }}
                        >
                            {letter}
                        </h3>
                    </span>
                )
            )}
        </div>
    );
};

export default AnimatedLoadingText;
