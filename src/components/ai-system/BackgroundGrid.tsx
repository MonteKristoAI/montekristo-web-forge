import { useEffect, useState } from "react";

interface BackgroundGridProps {
  mousePosition: { x: number; y: number };
}

export const BackgroundGrid = ({ mousePosition }: BackgroundGridProps) => {
  const [gridPhase, setGridPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGridPhase(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const hueShift = Math.sin(gridPhase * 0.01) * 30;
  const parallaxX = (mousePosition.x - 300) * 0.05;
  const parallaxY = (mousePosition.y - 240) * 0.05;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Neural Network Background */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          filter: `hue-rotate(${hueShift}deg)`,
        }}
      >
        <defs>
          <pattern id="neuralGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1.5" fill="hsl(var(--primary))" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="1" fill="hsl(var(--primary))" opacity="0.2" />
            <circle cx="60" cy="0" r="1" fill="hsl(var(--primary))" opacity="0.2" />
            <circle cx="0" cy="60" r="1" fill="hsl(var(--primary))" opacity="0.2" />
            <circle cx="60" cy="60" r="1" fill="hsl(var(--primary))" opacity="0.2" />
            
            {/* Connection lines */}
            <line x1="30" y1="30" x2="0" y2="0" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="6s" repeatCount="indefinite" />
            </line>
            <line x1="30" y1="30" x2="60" y2="0" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="7s" repeatCount="indefinite" />
            </line>
            <line x1="30" y1="30" x2="0" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
            </line>
          </pattern>

          {/* Flowing particles */}
          <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-200 0;800 0;-200 0"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#neuralGrid)" />
        
        {/* Data flow lines */}
        {Array.from({ length: 3 }, (_, i) => (
          <line
            key={i}
            x1="0"
            y1={80 + i * 120}
            x2="100%"
            y2={100 + i * 120}
            stroke="url(#particleGradient)"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
      </svg>
    </div>
  );
};