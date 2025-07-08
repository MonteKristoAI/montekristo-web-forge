import { motion } from 'framer-motion';
import { NodeData } from './types';

interface NodeComponentProps {
  node: NodeData;
  isHovered: boolean;
  onHover: (node: NodeData | null) => void;
  onClick: (node: NodeData) => void;
}

export const NodeComponent = ({ node, isHovered, onHover, onClick }: NodeComponentProps) => {
  const isCenterNode = node.id === 'business-os';
  const radius = isCenterNode ? 45 : 25; // Larger center node
  const scale = isHovered ? 1.2 : 1;
  const labelScale = isHovered ? 1.05 : 1;

  return (
    <g
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(node)}
    >
      {/* Glow effect */}
      <defs>
        <filter id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id={`text-glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id={`gradient-${node.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={node.color} stopOpacity="0.9"/>
          <stop offset="70%" stopColor={node.color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
        </radialGradient>
        <linearGradient id={`text-gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={node.color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7"/>
        </linearGradient>
        {isCenterNode && (
          <linearGradient id="center-underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6"/>
            <stop offset="50%" stopColor={node.color} stopOpacity="0.9"/>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6"/>
          </linearGradient>
        )}
      </defs>

      {/* Outer pulse ring */}
      <motion.circle
        r={radius + 10}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        strokeOpacity="0.3"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main node circle */}
      <motion.circle
        r={radius}
        fill={`url(#gradient-${node.id})`}
        filter={`url(#glow-${node.id})`}
        style={{
          filter: `drop-shadow(0 0 ${isHovered ? '15px' : '8px'} ${node.color}40)`
        }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Node label with Poppins */}
      <motion.text
        y={isCenterNode ? radius + 35 : radius + 25}
        textAnchor="middle"
        className={`font-poppins ${isCenterNode ? 'text-lg font-bold' : 'text-sm font-semibold'} fill-foreground`}
        style={{
          fill: '#111111',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          filter: `url(#text-glow-${node.id})`,
          textShadow: `0 0 12px ${node.color}`,
        }}
        animate={{ 
          scale: labelScale,
          opacity: isHovered ? 1 : 0.85
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {node.label}
      </motion.text>
      
      {/* Central node synchronized underline glow */}
      {isCenterNode && (
        <motion.line
          id="center-label-glow"
          x1={-40}
          x2={40}
          y1={radius + 42}
          y2={radius + 42}
          stroke="url(#center-underline-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 0.7 }}
        />
      )}

      {/* Center node special styling */}
      {isCenterNode && (
        <motion.circle
          r={radius - 5}
          fill="none"
          stroke={node.color}
          strokeWidth="2"
          strokeOpacity="0.6"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      )}
    </g>
  );
};