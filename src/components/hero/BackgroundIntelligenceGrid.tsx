
import { useEffect, useState } from "react";

interface BackgroundIntelligenceGridProps {
  className?: string;
}

export const BackgroundIntelligenceGrid = ({ className = "" }: BackgroundIntelligenceGridProps) => {
  const [gridPhase, setGridPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGridPhase(prev => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ opacity: 0.15 }}
      >
        <defs>
          <pattern id="neuralGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle 
              cx="30" 
              cy="30" 
              r="2" 
              fill="#6366F1" 
              opacity={0.3 + Math.sin(gridPhase * 0.05) * 0.2}
            />
            <circle 
              cx="10" 
              cy="10" 
              r="1" 
              fill="#8B5CF6" 
              opacity={0.2 + Math.sin((gridPhase + 30) * 0.03) * 0.15}
            />
            <circle 
              cx="50" 
              cy="20" 
              r="1.5" 
              fill="#3B82F6" 
              opacity={0.25 + Math.sin((gridPhase + 60) * 0.04) * 0.18}
            />
          </pattern>
          
          <linearGradient id="intelligenceFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.05">
              <animate attributeName="stop-opacity" values="0.05;0.15;0.05" dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.08">
              <animate attributeName="stop-opacity" values="0.08;0.2;0.08" dur="6s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05">
              <animate attributeName="stop-opacity" values="0.05;0.12;0.05" dur="10s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#neuralGrid)" />
        <rect width="100%" height="100%" fill="url(#intelligenceFlow)" />
      </svg>
    </div>
  );
};
