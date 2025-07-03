
interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  isActive: boolean;
  pulsePhase: number;
  className?: string;
}

export const ConnectionLine = ({ 
  from, 
  to, 
  color, 
  isActive, 
  pulsePhase,
  className = "" 
}: ConnectionLineProps) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 20; // Curve upward

  const pathData = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <svg 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id={`dataPulse-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="30%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="70%" stopColor={color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor="transparent"/>
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-100 0;200 0;-100 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <filter id={`lineGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Base connection line */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={isActive ? "3" : "1.5"}
        strokeOpacity={isActive ? "0.8" : "0.4"}
        fill="none"
        filter={isActive ? `url(#lineGlow-${color})` : 'none'}
        className="transition-all duration-300"
      />

      {/* Data pulse overlay */}
      <path
        d={pathData}
        stroke={`url(#dataPulse-${color})`}
        strokeWidth="2"
        fill="none"
        opacity={isActive ? "1" : "0.6"}
      />

      {/* Micro data particles */}
      {[...Array(3)].map((_, i) => {
        const progress = ((pulsePhase + i * 30) % 100) / 100;
        const pointOnCurve = getPointOnCurve(from, { x: midX, y: midY }, to, progress);
        
        return (
          <circle
            key={i}
            cx={pointOnCurve.x}
            cy={pointOnCurve.y}
            r="2"
            fill={color}
            opacity={0.6 + Math.sin((pulsePhase + i * 20) * 0.1) * 0.3}
            filter={`url(#lineGlow-${color})`}
          />
        );
      })}
    </svg>
  );
};

// Helper function to get point on quadratic curve
function getPointOnCurve(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  t: number
) {
  const x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * control.x + Math.pow(t, 2) * end.x;
  const y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * control.y + Math.pow(t, 2) * end.y;
  return { x, y };
}
