import { useState, useEffect, useRef } from "react";
import { BackgroundGrid } from "./ai-system/BackgroundGrid";
import { BusinessOSCore } from "./ai-system/BusinessOSCore";
import { AIAgent } from "./ai-system/AIAgent";
import { ImpactOverlay } from "./ai-system/ImpactOverlay";

interface AIBlueprintGeneratorProps {
  className?: string;
}

const agents = [
  { 
    id: 1, 
    label: "Lead Qualifier", 
    angle: 0, 
    gradientStart: "#F59E0B", 
    gradientEnd: "#F43F5E",
    benefit: "Identifies high-intent prospects with 89% accuracy"
  },
  { 
    id: 2, 
    label: "Outreach Agent", 
    angle: 72, 
    gradientStart: "#06B6D4", 
    gradientEnd: "#3B82F6",
    benefit: "Personalizes outreach at scale with human-like precision"
  },
  { 
    id: 3, 
    label: "CRM Sync", 
    angle: 144, 
    gradientStart: "#A855F7", 
    gradientEnd: "#6366F1",
    benefit: "Automatically syncs and enriches contact data"
  },
  { 
    id: 4, 
    label: "Content Repurposer", 
    angle: 216, 
    gradientStart: "#10B981", 
    gradientEnd: "#3B82F6",
    benefit: "Transforms one piece into 10+ formats instantly"
  },
  { 
    id: 5, 
    label: "Sales Trainer", 
    angle: 288, 
    gradientStart: "#EC4899", 
    gradientEnd: "#8B5CF6",
    benefit: "Provides real-time coaching during sales calls"
  }
];

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [constellation, setConstellation] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 300, y: 240 });
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constellation reconfiguration
  useEffect(() => {
    const interval = setInterval(() => {
      setConstellation(prev => (prev + 1) % 3);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }

      // Reset idle timer
      if (idleTimer) clearTimeout(idleTimer);
      const newTimer = setTimeout(() => {
        setConstellation(prev => (prev + 1) % 3);
      }, 15000);
      setIdleTimer(newTimer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [idleTimer]);

  // Responsive breakpoints
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const getAgentPosition = (agent: typeof agents[0]) => {
    const baseRadius = isMobile ? 100 : 140;
    const morphOffset = constellation * 30;
    const radius = baseRadius + (agent.id % 2 === 0 ? morphOffset : -morphOffset);
    const adjustedAngle = agent.angle + (constellation * 15);
    const radian = (adjustedAngle * Math.PI) / 180;
    
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  if (isMobile) {
    return (
      <div className={`relative w-full h-96 ${className}`} ref={containerRef}>
        <BackgroundGrid mousePosition={mousePosition} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
          {/* Mobile Core */}
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <BusinessOSCore 
                mousePosition={{ x: 60, y: 60 }}
                isAnyAgentHovered={hoveredAgent !== null}
              />
            </svg>
          </div>

          {/* Mobile Agent Carousel */}
          <div className="flex space-x-4 overflow-x-auto pb-4 px-4 w-full">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="flex-shrink-0 text-center"
                onTouchStart={() => setHoveredAgent(agent.id)}
                onTouchEnd={() => setHoveredAgent(null)}
              >
                <div 
                  className={`w-16 h-16 rounded-full transition-all duration-300 ${
                    hoveredAgent === agent.id ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${agent.gradientStart}, ${agent.gradientEnd})`,
                    boxShadow: `0 0 ${hoveredAgent === agent.id ? '20px' : '10px'} ${agent.gradientStart}40`,
                  }}
                />
                <p className="text-xs mt-2 text-white font-medium">{agent.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ImpactOverlay />
      </div>
    );
  }

  return (
    <div className={`relative w-[600px] h-[480px] ${className}`} ref={containerRef}>
      {/* Layer 1: Background */}
      <BackgroundGrid mousePosition={mousePosition} />
      
      {/* Layer 2 & 3: Main Visualization */}
      <svg
        width="600"
        height="480"
        viewBox="0 0 600 480"
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.3))' }}
      >
        {/* Layer 2: Business OS Core */}
        <BusinessOSCore 
          mousePosition={mousePosition}
          isAnyAgentHovered={hoveredAgent !== null}
        />

        {/* Layer 3: Dynamic AI Agents */}
        {agents.map(agent => {
          const position = getAgentPosition(agent);
          return (
            <AIAgent
              key={agent.id}
              agent={agent}
              position={position}
              isHovered={hoveredAgent === agent.id}
              onHover={setHoveredAgent}
              constellation={constellation}
            />
          );
        })}
      </svg>

      {/* Layer 4: Human Impact Overlay */}
      <ImpactOverlay />
    </div>
  );
};