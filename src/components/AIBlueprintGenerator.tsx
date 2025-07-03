
import { useState, useEffect, useRef } from "react";

interface AIBlueprintGeneratorProps {
  className?: string;
}

const agents = [
  { 
    id: 1, 
    label: "Lead Qualifier", 
    angle: 0, 
    gradient: "from-amber-500 to-rose-500",
    color: "#F59E0B",
    description: "Scores and prioritizes prospects automatically"
  },
  { 
    id: 2, 
    label: "Outreach Agent", 
    angle: 72, 
    gradient: "from-cyan-500 to-blue-500",
    color: "#06B6D4",
    description: "Personalizes and sends targeted campaigns"
  },
  { 
    id: 3, 
    label: "CRM Sync", 
    angle: 144, 
    gradient: "from-violet-500 to-indigo-500",
    color: "#A855F7",
    description: "Syncs data across all business tools"
  },
  { 
    id: 4, 
    label: "Content Repurposer", 
    angle: 216, 
    gradient: "from-emerald-500 to-blue-500",
    color: "#10B981",
    description: "Turns videos into content threads"
  },
  { 
    id: 5, 
    label: "Sales Trainer", 
    angle: 288, 
    gradient: "from-pink-500 to-purple-500",
    color: "#EC4899",
    description: "Coaches team with AI-driven insights"
  }
];

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [layoutPhase, setLayoutPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [buildingAgent, setBuildingAgent] = useState<number | null>(null);
  const [handshakeAgents, setHandshakeAgents] = useState<[number, number] | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Layout morphing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLayoutPhase(prev => (prev + 1) % 4);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Core pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Agent building animation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgent = Math.floor(Math.random() * agents.length) + 1;
      setBuildingAgent(randomAgent);
      setTimeout(() => setBuildingAgent(null), 2000);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Agent handshake animation
  useEffect(() => {
    const interval = setInterval(() => {
      const agent1 = Math.floor(Math.random() * agents.length) + 1;
      let agent2 = Math.floor(Math.random() * agents.length) + 1;
      while (agent2 === agent1) {
        agent2 = Math.floor(Math.random() * agents.length) + 1;
      }
      setHandshakeAgents([agent1, agent2]);
      setTimeout(() => setHandshakeAgents(null), 1500);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getAgentPosition = (agent: typeof agents[0]) => {
    const baseRadius = 130;
    const layoutOffset = Math.sin(layoutPhase * 0.5) * 15;
    const radius = baseRadius + layoutOffset + (agent.id % 2 === 0 ? 10 : -10);
    const adjustedAngle = agent.angle + (layoutPhase * 5);
    const radian = (adjustedAngle * Math.PI) / 180;
    
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  const getCoreGlow = () => {
    const baseBrightness = 0.6;
    const pulseBrightness = Math.sin(pulsePhase * 0.1) * 0.3;
    return baseBrightness + pulseBrightness;
  };

  return (
    <div className={`relative w-96 h-96 ${className}`}>
      <svg
        ref={svgRef}
        width="384"
        height="384"
        viewBox="0 0 384 384"
        className="absolute inset-0"
        role="img"
        aria-label="Visual representation of custom-built AI ecosystem"
      >
        <defs>
          {/* Enhanced gradients for agents */}
          {agents.map(agent => (
            <radialGradient key={`agentGradient-${agent.id}`} id={`agentGradient-${agent.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.9"/>
              <stop offset="70%" stopColor={agent.color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={agent.color} stopOpacity="0.2"/>
            </radialGradient>
          ))}
          
          {/* Neural core gradient */}
          <radialGradient id="neuralCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#6366F1" stopOpacity="0.7"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2"/>
          </radialGradient>

          {/* Data pulse gradient */}
          <linearGradient id="dataPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.8"/>
            <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="transparent"/>
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-100 0;200 0;-100 0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Grid pattern */}
          <pattern id="neuralGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(139, 92, 246, 0.1)"/>
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="0.5"/>
          </pattern>

          {/* Filters for glow effects */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fading grid background */}
        <rect width="100%" height="100%" fill="url(#neuralGrid)" opacity="0.4"/>
        <radialGradient id="fadeGrid" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(250, 248, 244, 1)"/>
          <stop offset="100%" stopColor="rgba(250, 248, 244, 0.2)"/>
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#fadeGrid)"/>

        {/* Connection lines with data pulses */}
        {agents.map(agent => {
          const pos = getAgentPosition(agent);
          const isHovered = hoveredAgent === agent.id;
          const isHandshaking = handshakeAgents?.includes(agent.id);
          const isBuilding = buildingAgent === agent.id;
          
          return (
            <g key={`connection-${agent.id}`}>
              {/* Base connection line */}
              <path
                d={`M 192 192 Q ${192 + pos.x * 0.3} ${192 + pos.y * 0.3} ${192 + pos.x} ${192 + pos.y}`}
                stroke={agent.color}
                strokeWidth={isHovered || isHandshaking ? "3" : "1.5"}
                strokeOpacity={isHovered || isHandshaking ? "0.8" : "0.4"}
                fill="none"
                className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ 
                  animationDelay: `${agent.id * 200}ms`,
                  filter: isHovered || isHandshaking ? 'url(#glow)' : 'none'
                }}
              />
              
              {/* Data pulse line */}
              <path
                d={`M 192 192 Q ${192 + pos.x * 0.3} ${192 + pos.y * 0.3} ${192 + pos.x} ${192 + pos.y}`}
                stroke="url(#dataPulse)"
                strokeWidth="2"
                fill="none"
                opacity={isBuilding ? "1" : "0.6"}
              />

              {/* Building effect */}
              {isBuilding && (
                <path
                  d={`M 192 192 Q ${192 + pos.x * 0.3} ${192 + pos.y * 0.3} ${192 + pos.x} ${192 + pos.y}`}
                  stroke="#34D399"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.8"
                  filter="url(#strongGlow)"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Handshake connection */}
        {handshakeAgents && (
          <line
            x1={192 + getAgentPosition(agents[handshakeAgents[0] - 1]).x}
            y1={192 + getAgentPosition(agents[handshakeAgents[0] - 1]).y}
            x2={192 + getAgentPosition(agents[handshakeAgents[1] - 1]).x}
            y2={192 + getAgentPosition(agents[handshakeAgents[1] - 1]).y}
            stroke="#F59E0B"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#glow)"
            className="animate-pulse"
          />
        )}

        {/* Neural Processing Core */}
        <g transform="translate(192, 192)">
          {/* Outer breathing ring */}
          <circle
            r={40 + Math.sin(pulsePhase * 0.05) * 5}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1"
            strokeOpacity="0.3"
            className={isLoaded ? 'animate-fade-in' : 'opacity-0'}
          />
          
          {/* Middle processing ring */}
          <circle
            r="32"
            fill="none"
            stroke="#6366F1"
            strokeWidth="2"
            strokeOpacity="0.4"
            className="animate-spin-slow"
            style={{ animationDuration: '12s' }}
          />
          
          {/* Core node */}
          <circle
            r="26"
            fill="url(#neuralCore)"
            filter="url(#strongGlow)"
            style={{ 
              opacity: getCoreGlow(),
              transform: `scale(${1 + Math.sin(pulsePhase * 0.08) * 0.1})`
            }}
            className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          />
          
          {/* Inner core */}
          <circle
            r="18"
            fill="#8B5CF6"
            opacity="0.6"
            className="animate-pulse"
          />
        </g>

        {/* AI Agent Nodes */}
        {agents.map(agent => {
          const pos = getAgentPosition(agent);
          const isHovered = hoveredAgent === agent.id;
          const isHandshaking = handshakeAgents?.includes(agent.id);
          const isBuilding = buildingAgent === agent.id;
          
          return (
            <g
              key={`agent-${agent.id}`}
              transform={`translate(${192 + pos.x}, ${192 + pos.y})`}
              className={`cursor-pointer transition-all duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${agent.id * 300 + 500}ms` }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              {/* Agent glow ring */}
              <circle
                r={isHovered ? "22" : "18"}
                fill="none"
                stroke={agent.color}
                strokeWidth="1"
                strokeOpacity="0.5"
                className="animate-pulse"
              />
              
              {/* Agent core */}
              <circle
                r={isHovered ? "16" : "13"}
                fill={`url(#agentGradient-${agent.id})`}
                filter={isHovered || isHandshaking || isBuilding ? "url(#strongGlow)" : "url(#glow)"}
                className="transition-all duration-300"
                style={{ 
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
              />
              
              {/* Building effect */}
              {isBuilding && (
                <circle
                  r="20"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="2"
                  opacity="0.8"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Agent Labels and Tooltips */}
      {agents.map(agent => {
        const pos = getAgentPosition(agent);
        const isHovered = hoveredAgent === agent.id;
        
        return (
          <div key={`label-${agent.id}`} className="absolute pointer-events-none">
            {/* Agent Label */}
            <div
              className={`text-xs font-medium text-[#041122] transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-110 font-semibold' : 'opacity-80'
              } ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{
                left: `${192 + pos.x - 35}px`,
                top: `${192 + pos.y + 28}px`,
                width: '70px',
                textAlign: 'center',
                animationDelay: `${agent.id * 300 + 800}ms`
              }}
            >
              {agent.label}
            </div>
            
            {/* Tooltip */}
            {isHovered && (
              <div
                className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#041122] shadow-lg animate-fade-in"
                style={{
                  left: `${192 + pos.x - 60}px`,
                  top: `${192 + pos.y - 50}px`,
                  width: '120px',
                  textAlign: 'center',
                  zIndex: 10
                }}
              >
                {agent.description}
              </div>
            )}
          </div>
        );
      })}

      {/* Central Business OS Label */}
      <div 
        className={`absolute text-sm font-bold text-white transition-all duration-300 ${
          isLoaded ? 'animate-fade-in' : 'opacity-0'
        }`}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textShadow: '0 0 10px #8B5CF6',
          animationDelay: '200ms',
          zIndex: 5
        }}
      >
        Business OS
      </div>
    </div>
  );
};
