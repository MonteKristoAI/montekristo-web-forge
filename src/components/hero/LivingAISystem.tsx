
import { useState, useEffect } from "react";
import { BackgroundIntelligenceGrid } from "./BackgroundIntelligenceGrid";
import { BusinessOSCore } from "./BusinessOSCore";
import { AIAgentNode } from "./AIAgentNode";
import { ConnectionLine } from "./ConnectionLine";

interface LivingAISystemProps {
  className?: string;
}

interface AgentWithAngle {
  id: number;
  label: string;
  color: string;
  gradient: string;
  description: string;
  benefit: string;
  angle: number;
}

const agents = [
  {
    id: 1,
    label: "Lead Qualifier",
    color: "#F59E0B",
    gradient: "from-amber-500 to-rose-500",
    description: "Scores and prioritizes prospects automatically",
    benefit: "+12 hrs/wk"
  },
  {
    id: 2,
    label: "Outreach Agent",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-500",
    description: "Personalizes and sends targeted campaigns",
    benefit: "+240% reply rate"
  },
  {
    id: 3,
    label: "CRM Sync",
    color: "#A855F7",
    gradient: "from-violet-500 to-indigo-500",
    description: "Syncs data across all business tools",
    benefit: "100% accuracy"
  },
  {
    id: 4,
    label: "Content Repurposer",
    color: "#10B981",
    gradient: "from-emerald-500 to-blue-500",
    description: "Turns videos into content threads",
    benefit: "10x content"
  },
  {
    id: 5,
    label: "Sales Trainer",
    color: "#EC4899",
    gradient: "from-pink-500 to-purple-500",
    description: "Coaches team with AI-driven insights",
    benefit: "+85% close rate"
  }
];

export const LivingAISystem = ({ className = "" }: LivingAISystemProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [systemPhase, setSystemPhase] = useState(0);
  const [adaptationPhase, setAdaptationPhase] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newAgentSpawning, setNewAgentSpawning] = useState(false);

  // System initialization
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // System adaptation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptationPhase(prev => (prev + 1) % 4);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Core system pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // System thinking cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // New agent spawning
  useEffect(() => {
    const interval = setInterval(() => {
      setNewAgentSpawning(true);
      setTimeout(() => setNewAgentSpawning(false), 3000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getAgentPosition = (agent: AgentWithAngle) => {
    const baseRadius = 140;
    const adaptationOffset = Math.sin((adaptationPhase + agent.id) * 0.5) * 15;
    const radius = baseRadius + adaptationOffset + (agent.id % 2 === 0 ? 12 : -12);
    const adjustedAngle = agent.angle + (adaptationPhase * 8) + Math.sin(systemPhase * 0.02) * 5;
    const radian = (adjustedAngle * Math.PI) / 180;
    
    return {
      x: 192 + Math.cos(radian) * radius,
      y: 192 + Math.sin(radian) * radius
    };
  };

  const agentsWithAngles: AgentWithAngle[] = agents.map((agent, i) => ({
    ...agent,
    angle: i * 72 // 360/5 agents
  }));

  return (
    <div className={`relative w-96 h-96 ${className}`}>
      {/* Layer 1: Background Intelligence Grid */}
      <BackgroundIntelligenceGrid />

      {/* Layer 2: Business OS Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BusinessOSCore 
          className={`transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Layer 3: Connection Lines */}
      {isLoaded && agentsWithAngles.map(agent => {
        const agentPos = getAgentPosition(agent);
        const corePos = { x: 192, y: 192 };
        const isActive = hoveredAgent === agent.id;
        
        return (
          <ConnectionLine
            key={`connection-${agent.id}`}
            from={corePos}
            to={agentPos}
            color={agent.color}
            isActive={isActive}
            pulsePhase={pulsePhase}
            className={`transition-all duration-500 ${
              isLoaded ? 'animate-fade-in' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* Layer 3: AI Agent Nodes */}
      {agentsWithAngles.map(agent => {
        const position = getAgentPosition(agent);
        const isHovered = hoveredAgent === agent.id;
        
        return (
          <AIAgentNode
            key={`agent-${agent.id}`}
            agent={agent}
            position={position}
            isHovered={isHovered}
            onHover={setHoveredAgent}
            pulsePhase={pulsePhase}
            className={`transition-all duration-700 ${
              isLoaded ? 'animate-fade-in opacity-100' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* New Agent Spawning Effect */}
      {newAgentSpawning && (
        <div 
          className="absolute animate-agent-build"
          style={{
            left: '170px',
            top: '100px',
            width: '44px',
            height: '44px'
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#34D399"
              strokeWidth="2"
              className="animate-pulse"
            />
            <circle
              cx="22"
              cy="22"
              r="12"
              fill="#34D399"
              opacity="0.6"
              className="animate-ping"
            />
          </svg>
        </div>
      )}

      {/* System Status Indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-[#041122]/60 font-medium">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            style={{ animationDuration: '1.5s' }}
          />
          <span>System Adapting</span>
        </div>
      </div>
    </div>
  );
};
