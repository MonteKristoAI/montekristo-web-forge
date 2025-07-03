import { useEffect, useState } from "react";

interface BusinessOSCoreProps {
  mousePosition: { x: number; y: number };
  isAnyAgentHovered: boolean;
}

export const BusinessOSCore = ({ mousePosition, isAnyAgentHovered }: BusinessOSCoreProps) => {
  const [thinkingPhase, setThinkingPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const centerX = 300;
  const centerY = 240;
  const tiltX = (mousePosition.x - centerX) * 0.03;
  const tiltY = (mousePosition.y - centerY) * 0.03;
  const glowIntensity = isAnyAgentHovered ? 25 : 15;

  return (
    <g transform={`translate(${centerX}, ${centerY})`}>
      <defs>
        <radialGradient id="businessOSGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="1" />
          <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
        </radialGradient>

        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow ring */}
      <circle
        r="80"
        fill="url(#coreGlow)"
        className="animate-pulse"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px #6366F1)`,
          transform: `scale(${1 + Math.sin(thinkingPhase * 0.02) * 0.1})`,
        }}
      />

      {/* Breathing pulse ring */}
      <circle
        r={65 + Math.sin(thinkingPhase * 0.03) * 5}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="animate-spin-slow"
      />

      {/* Main core */}
      <circle
        r="60"
        fill="url(#businessOSGradient)"
        style={{
          transform: `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${1 + Math.sin(thinkingPhase * 0.025) * 0.15})`,
          filter: `drop-shadow(0 0 ${glowIntensity}px #6366F1)`,
        }}
        className="transition-all duration-300"
      />

      {/* Inner thinking particles */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (thinkingPhase + i * 72) * (Math.PI / 180);
        const radius = 35 + Math.sin(thinkingPhase * 0.01 + i) * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#FFFFFF"
            opacity={0.6 + Math.sin(thinkingPhase * 0.02 + i) * 0.3}
          />
        );
      })}

      {/* Data stream lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45;
        const radian = (angle * Math.PI) / 180;
        const startR = 65;
        const endR = 120;
        
        return (
          <line
            key={i}
            x1={Math.cos(radian) * startR}
            y1={Math.sin(radian) * startR}
            x2={Math.cos(radian) * endR}
            y2={Math.sin(radian) * endR}
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeOpacity="0.4"
            className="animate-pulse"
          />
        );
      })}

      {/* Central label */}
      <text
        textAnchor="middle"
        dy="6"
        className="text-sm font-bold fill-white"
        style={{
          filter: 'drop-shadow(0 0 10px #6366F1)',
          textShadow: '0 0 10px #6366F1',
        }}
      >
        Business OS
      </text>
    </g>
  );
};