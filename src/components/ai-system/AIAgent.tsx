import { useState } from "react";

interface Agent {
  id: number;
  label: string;
  angle: number;
  gradientStart: string;
  gradientEnd: string;
  benefit: string;
}

interface AIAgentProps {
  agent: Agent;
  position: { x: number; y: number };
  isHovered: boolean;
  onHover: (id: number | null) => void;
  constellation: number;
}

export const AIAgent = ({ agent, position, isHovered, onHover, constellation }: AIAgentProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    onHover(agent.id);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    onHover(null);
    setShowTooltip(false);
  };

  const centerX = 300;
  const centerY = 240;
  const finalX = centerX + position.x;
  const finalY = centerY + position.y;

  return (
    <g
      transform={`translate(${finalX}, ${finalY})`}
      className="cursor-pointer transition-all duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <radialGradient id={`agentGradient-${agent.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={agent.gradientStart} stopOpacity="0.9" />
          <stop offset="100%" stopColor={agent.gradientEnd} stopOpacity="0.6" />
        </radialGradient>

        <radialGradient id={`agentGlow-${agent.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={agent.gradientStart} stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection line to center */}
      <line
        x1="0"
        y1="0"
        x2={-position.x}
        y2={-position.y}
        stroke={agent.gradientStart}
        strokeWidth={isHovered ? "4" : "2"}
        strokeOpacity={isHovered ? "0.8" : "0.4"}
        className="transition-all duration-300"
      />

      {/* Data particles along connection */}
      {isHovered && Array.from({ length: 3 }, (_, i) => {
        const t = (i + 1) * 0.25;
        const particleX = -position.x * t;
        const particleY = -position.y * t;
        
        return (
          <circle
            key={i}
            cx={particleX}
            cy={particleY}
            r="2"
            fill={agent.gradientStart}
            opacity="0.8"
            className="animate-pulse"
          />
        );
      })}

      {/* Agent glow */}
      <circle
        r={isHovered ? "35" : "25"}
        fill={`url(#agentGlow-${agent.id})`}
        className="transition-all duration-300"
      />

      {/* Agent node */}
      <circle
        r={isHovered ? "24" : "18"}
        fill={`url(#agentGradient-${agent.id})`}
        className="transition-all duration-300"
        style={{
          filter: `drop-shadow(0 0 ${isHovered ? '15px' : '8px'} ${agent.gradientStart})`,
        }}
      />

      {/* Orbit ring */}
      <circle
        r={isHovered ? "30" : "24"}
        fill="none"
        stroke={agent.gradientStart}
        strokeWidth="1"
        strokeOpacity="0.6"
        className="animate-pulse"
      />

      {/* Agent label */}
      <text
        textAnchor="middle"
        dy="50"
        className={`text-xs font-medium fill-white transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-80'
        }`}
        style={{
          filter: `drop-shadow(0 0 8px ${agent.gradientStart})`,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {agent.label}
      </text>

      {/* Tooltip */}
      {showTooltip && (
        <foreignObject x="-80" y="-80" width="160" height="60">
          <div className="bg-black/80 text-white text-xs p-2 rounded-lg backdrop-blur-sm border border-white/20">
            {agent.benefit}
          </div>
        </foreignObject>
      )}
    </g>
  );
};