
import { useState, useEffect, useRef } from "react";

interface BusinessOSCoreProps {
  className?: string;
  onMouseMove?: (x: number, y: number) => void;
  hoveredAgent?: number | null;
}

export const BusinessOSCore = ({ className = "", onMouseMove, hoveredAgent }: BusinessOSCoreProps) => {
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!coreRef.current) return;
    
    const rect = coreRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    setMousePosition({ x: x * 8, y: y * 8 });
    onMouseMove?.(x, y);
  };

  const getBreathingScale = () => {
    const baseScale = 1 + Math.sin(thinkingPhase * 0.035) * 0.08; // Enhanced breathing
    return hoveredAgent ? baseScale * 1.05 : baseScale; // Slight scale on hover
  };

  const getThinkingIntensity = () => {
    const baseIntensity = 0.75 + Math.sin(thinkingPhase * 0.055) * 0.2;
    return hoveredAgent ? Math.min(baseIntensity * 1.15, 1) : baseIntensity;
  };

  const getCoreOpacity = () => {
    return hoveredAgent ? 0.6 : 1;
  };

  return (
    <div 
      ref={coreRef}
      className={`relative w-40 h-40 transition-all duration-500 ${className}`}
      onMouseMove={handleMouseMove}
      style={{ 
        cursor: 'none',
        opacity: getCoreOpacity()
      }}
    >
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.95"/>
            <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.85"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3"/>
          </radialGradient>
          
          <filter id="coreGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbital particles - more elegant */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) + (thinkingPhase * 1.2);
          const radius = 55 + Math.sin((thinkingPhase + i * 25) * 0.035) * 10;
          const x = 80 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 80 + Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.5 + Math.sin((thinkingPhase + i * 15) * 0.08) * 1}
              fill="#8B5CF6"
              opacity={0.4 + Math.sin((thinkingPhase + i * 12) * 0.06) * 0.3}
              filter="url(#coreGlow)"
            />
          );
        })}

        {/* Gentle breathing outer ring */}
        <circle
          cx="80"
          cy="80"
          r={60 + Math.sin(thinkingPhase * 0.025) * 6}
          fill="none"
          stroke="#6366F1"
          strokeWidth="2"
          strokeOpacity="0.25"
          filter="url(#coreGlow)"
        />

        {/* Main core with enhanced breathing */}
        <g transform={`translate(80, 80) scale(${getBreathingScale()}) translate(${mousePosition.x}, ${mousePosition.y})`}>
          <circle
            r="42"
            fill="url(#coreGradient)"
            filter="url(#coreGlow)"
            style={{ opacity: getThinkingIntensity() }}
          />
          
          {/* Inner neural core */}
          <circle
            r="32"
            fill="#8B5CF6"
            opacity="0.4"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          
          {/* Central thinking node */}
          <circle
            r="18"
            fill="#6366F1"
            opacity={0.85 + Math.sin(thinkingPhase * 0.08) * 0.15}
            filter="url(#coreGlow)"
          />
        </g>

        {/* Data pulse streams - more refined */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const streamLength = 50;
          const startX = 80 + Math.cos(angle * Math.PI / 180) * 42;
          const startY = 80 + Math.sin(angle * Math.PI / 180) * 42;
          const endX = 80 + Math.cos(angle * Math.PI / 180) * (42 + streamLength);
          const endY = 80 + Math.sin(angle * Math.PI / 180) * (42 + streamLength);
          
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeOpacity={0.3 + Math.sin((thinkingPhase + i * 25) * 0.05) * 0.2}
              filter="url(#coreGlow)"
            />
          );
        })}
      </svg>

      {/* Business OS Label - premium typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="text-base font-space-grotesk font-bold text-white text-center leading-tight"
          style={{ 
            textShadow: '0 0 20px #8B5CF6, 0 0 40px #6366F1, 0 2px 4px rgba(0,0,0,0.3)',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            letterSpacing: '0.05em'
          }}
        >
          Business<br/>OS
        </span>
      </div>
    </div>
  );
};
