
import { useState, useEffect, useRef } from "react";

interface BusinessOSCoreProps {
  className?: string;
  onMouseMove?: (x: number, y: number) => void;
}

export const BusinessOSCore = ({ className = "", onMouseMove }: BusinessOSCoreProps) => {
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!coreRef.current) return;
    
    const rect = coreRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    setMousePosition({ x: x * 10, y: y * 10 });
    onMouseMove?.(x, y);
  };

  const getThinkingIntensity = () => {
    return 0.6 + Math.sin(thinkingPhase * 0.08) * 0.3;
  };

  const getBreathingScale = () => {
    return 1 + Math.sin(thinkingPhase * 0.06) * 0.08;
  };

  return (
    <div 
      ref={coreRef}
      className={`relative w-32 h-32 ${className}`}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.8"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2"/>
          </radialGradient>
          
          <filter id="coreGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbital particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) + (thinkingPhase * 2);
          const radius = 45 + Math.sin((thinkingPhase + i * 20) * 0.05) * 8;
          const x = 64 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 64 + Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2 + Math.sin((thinkingPhase + i * 15) * 0.1) * 1}
              fill="#8B5CF6"
              opacity={0.4 + Math.sin((thinkingPhase + i * 10) * 0.08) * 0.3}
              className="animate-pulse"
            />
          );
        })}

        {/* Breathing outer ring */}
        <circle
          cx="64"
          cy="64"
          r={50 + Math.sin(thinkingPhase * 0.04) * 6}
          fill="none"
          stroke="#6366F1"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Main core */}
        <g transform={`translate(64, 64) scale(${getBreathingScale()}) translate(${mousePosition.x}, ${mousePosition.y})`}>
          <circle
            r="35"
            fill="url(#coreGradient)"
            filter="url(#coreGlow)"
            style={{ opacity: getThinkingIntensity() }}
          />
          
          {/* Inner neural core */}
          <circle
            r="25"
            fill="#8B5CF6"
            opacity="0.4"
            className="animate-pulse"
          />
          
          {/* Central thinking node */}
          <circle
            r="12"
            fill="#6366F1"
            opacity={0.8 + Math.sin(thinkingPhase * 0.12) * 0.2}
          />
        </g>

        {/* Data pulse streams */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const streamLength = 40;
          const startX = 64 + Math.cos(angle * Math.PI / 180) * 35;
          const startY = 64 + Math.sin(angle * Math.PI / 180) * 35;
          const endX = 64 + Math.cos(angle * Math.PI / 180) * (35 + streamLength);
          const endY = 64 + Math.sin(angle * Math.PI / 180) * (35 + streamLength);
          
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeOpacity={0.3 + Math.sin((thinkingPhase + i * 20) * 0.06) * 0.2}
              filter="url(#coreGlow)"
            />
          );
        })}
      </svg>

      {/* Business OS Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="text-sm font-bold text-white text-center leading-tight"
          style={{ 
            textShadow: '0 0 15px #8B5CF6, 0 0 30px #6366F1',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        >
          Business<br/>OS
        </span>
      </div>
    </div>
  );
};
