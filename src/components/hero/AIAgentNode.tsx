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
  isHovered: boolean;
  onHover: (id: number | null) => void;
  pulsePhase: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AIAgentNode = ({ 
  agent, 
  position, 
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

      {/* Agent Label */}
      <div
        className={`text-xs font-medium text-[#041122] transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-110 font-semibold' : 'opacity-80'
        }`}
        style={{
          left: `${position.x - 35}px`,
          top: `${position.y + 30}px`,
          width: '70px',
          textAlign: 'center'
        }}
      >
        {agent.label}
      </div>

      {/* Hover Tooltip */}
      {isHovered && (
        <div
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#041122] shadow-lg animate-fade-in pointer-events-none"
          style={{
            left: `${position.x - 60}px`,
            top: `${position.y - 55}px`,
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
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg animate-fade-in pointer-events-none"
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
