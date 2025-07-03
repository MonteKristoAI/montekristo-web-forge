
import { useState } from "react";

interface AIAgentNodeProps {
  agent: {
    id: number;
    label: string;
    color: string;
    gradient: string;
    description: string;
    benefit: string;
  };
  position: { x: number; y: number };
  labelPosition: { x: number; y: number };
  isHovered: boolean;
  onHover: (id: number | null) => void;
  pulsePhase: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AIAgentNode = ({ 
  agent, 
  position, 
  labelPosition,
  isHovered, 
  onHover, 
  pulsePhase,
  className = "",
  style
}: AIAgentNodeProps) => {
  const [showBenefit, setShowBenefit] = useState(false);

  // Show benefit popup randomly
  useState(() => {
    const timer = setTimeout(() => {
      setShowBenefit(true);
      setTimeout(() => setShowBenefit(false), 3000);
    }, Math.random() * 15000 + 8000);
    
    return () => clearTimeout(timer);
  });

  return (
    <div className={`absolute pointer-events-none ${className}`} style={style}>
      {/* Agent Node */}
      <div
        className="relative cursor-pointer pointer-events-auto"
        style={{
          left: `${position.x - 25}px`,
          top: `${position.y - 25}px`,
          width: '50px',
          height: '50px',
        }}
        onMouseEnter={() => onHover(agent.id)}
        onMouseLeave={() => onHover(null)}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <defs>
            <radialGradient id={`gradient-${agent.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.9"/>
              <stop offset="70%" stopColor={agent.color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={agent.color} stopOpacity="0.2"/>
            </radialGradient>
            
            <filter id={`glow-${agent.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <linearGradient id={`labelGradient-${agent.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={agent.color} stopOpacity="0.7"/>
            </linearGradient>
          </defs>

          {/* Outer glow ring */}
          <circle
            cx="25"
            cy="25"
            r={isHovered ? "22" : "18"}
            fill="none"
            stroke={agent.color}
            strokeWidth="1"
            strokeOpacity={0.4 + Math.sin((pulsePhase + agent.id * 15) * 0.08) * 0.2}
            className="transition-all duration-300"
          />

          {/* Main node */}
          <circle
            cx="25"
            cy="25"
            r={isHovered ? "16" : "13"}
            fill={`url(#gradient-${agent.id})`}
            filter={`url(#glow-${agent.id})`}
            className="transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0.8,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        </svg>
      </div>

      {/* Enhanced Agent Label with collision avoidance */}
      <div
        className={`font-inter font-medium text-xs transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-105 font-semibold' : 'opacity-90'
        }`}
        style={{
          left: `${labelPosition.x - 45}px`,
          top: `${labelPosition.y - 8}px`,
          width: '90px',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${agent.color}20, ${agent.color}10)`,
          color: agent.color,
          textShadow: `0 0 10px ${agent.color}40, 0 1px 2px rgba(255,255,255,0.8)`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${agent.color}30`,
          borderRadius: '12px',
          padding: '4px 8px',
          letterSpacing: '0.025em',
          fontSize: '11px',
          fontWeight: '500'
        }}
      >
        {agent.label}
      </div>

      {/* Hover Tooltip */}
      {isHovered && (
        <div
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#041122] shadow-lg animate-fade-in pointer-events-none font-inter"
          style={{
            left: `${position.x - 60}px`,
            top: `${position.y - 65}px`,
            width: '120px',
            textAlign: 'center',
            zIndex: 10
          }}
        >
          {agent.description}
        </div>
      )}

      {/* Benefit Popup */}
      {showBenefit && (
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg animate-fade-in pointer-events-none font-inter"
          style={{
            left: `${position.x - 40}px`,
            top: `${position.y - 70}px`,
            width: '80px',
            textAlign: 'center',
            zIndex: 15
          }}
        >
          {agent.benefit}
        </div>
      )}
    </div>
  );
};
