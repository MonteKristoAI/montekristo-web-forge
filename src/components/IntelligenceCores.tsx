import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, useAnimation } from 'framer-motion';

interface Core {
  id: string;
  label: string;
  color: string;
  glowColor: string;
  position: { x: number; y: number };
}

const cores: Core[] = [
  {
    id: 'discovery',
    label: 'DISCOVERY',
    color: '#FF6B47', // warm coral
    glowColor: '#FF6B47',
    position: { x: 80, y: 120 }
  },
  {
    id: 'blueprint',
    label: 'BLUEPRINT', 
    color: '#B946DB', // magenta-violet
    glowColor: '#B946DB',
    position: { x: 220, y: 80 }
  },
  {
    id: 'deployment',
    label: 'DEPLOYMENT',
    color: '#00BFFF', // electric-blue
    glowColor: '#00BFFF',
    position: { x: 280, y: 200 }
  },
  {
    id: 'optimisation',
    label: 'OPTIMISATION',
    color: '#00E5CC', // cyan-teal
    glowColor: '#00E5CC',
    position: { x: 140, y: 240 }
  }
];

export const IntelligenceCores = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'assembly' | 'idle'>('intro');
  const controls = useAnimation();

  // 7-second cinematic loop timeline
  useEffect(() => {
    if (!isInView) return;

    const runAnimation = async () => {
      if (shouldReduceMotion) {
        setAnimationPhase('idle');
        return;
      }

      // Phase 1: Intro (0-1s) - Fade-in + particle drift
      setAnimationPhase('intro');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Assembly (1-3s) - Magnetic snap-together
      setAnimationPhase('assembly');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Phase 3: Idle loop (3-7s) - Breathing and oscillation
      setAnimationPhase('idle');
    };

    runAnimation();
  }, [isInView, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      className="relative w-96 h-96 mx-auto"
      initial={{ opacity: 0, scale: 0.93, y: '12%' }}
      animate={isInView ? { opacity: 1, scale: 1, y: '0%' } : { opacity: 0, scale: 0.93, y: '12%' }}
      transition={{ duration: 1, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Cinematic hover shadow bloom */}
      {isHovered && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1.2,
            filter: 'blur(30px)'
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle, rgba(0, 234, 255, 0.2) 0%, rgba(0, 234, 255, 0.1) 40%, transparent 70%)',
            transform: 'translateZ(14px)',
            boxShadow: '0 0 40px rgba(0, 234, 255, 0.2)'
          }}
        />
      )}

      {/* Ambient breathing glow for idle phase */}
      {animationPhase === 'idle' && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 71, 0.1) 0%, rgba(185, 70, 219, 0.1) 25%, rgba(0, 191, 255, 0.1) 50%, rgba(0, 229, 204, 0.1) 75%, transparent 100%)',
            filter: 'blur(20px)'
          }}
        />
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 320"
        className="overflow-visible"
        style={{ background: 'transparent' }}
      >
        <defs>
          {cores.map(core => (
            <filter key={`glow-${core.id}`} id={`glow-${core.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
          
          {/* Particle gradient */}
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#00eaff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00eaff" stopOpacity="0"/>
          </radialGradient>

          {/* Obsidian shell gradient */}
          <linearGradient id="obsidianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a"/>
            <stop offset="30%" stopColor="#0d1117"/>
            <stop offset="70%" stopColor="#000000"/>
            <stop offset="100%" stopColor="#0a0a0a"/>
          </linearGradient>

          {/* Core energy gradients */}
          {cores.map(core => (
            <radialGradient key={`coreGradient-${core.id}`} id={`coreGradient-${core.id}`}>
              <stop offset="0%" stopColor={core.color} stopOpacity="0.9"/>
              <stop offset="60%" stopColor={core.color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={core.color} stopOpacity="0.2"/>
            </radialGradient>
          ))}
        </defs>

        {/* Floating nanite particles - Fibonacci spiral drift */}
        <motion.g
          animate={{
            rotate: shouldReduceMotion ? 0 : [0, 360],
            scale: animationPhase === 'idle' ? [1, 1.05, 1] : 1,
            opacity: animationPhase === 'intro' ? [0, 0.6] : 0.6
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1, ease: "easeOut" }
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => {
            // Fibonacci spiral positioning
            const angle = i * (Math.PI * 2 * 0.618); // Golden ratio
            const radius = 30 + i * 8;
            const x = 200 + Math.cos(angle) * radius;
            const y = 160 + Math.sin(angle) * radius;
            
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? "1.5" : "1"}
                fill="url(#particleGradient)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: animationPhase === 'intro' ? [0, 0.8, 0.4] : [0.4, 0.8, 0.4],
                  scale: [0.5, 1.2, 0.8],
                  x: shouldReduceMotion ? 0 : [0, Math.sin(i) * 4, 0],
                  y: shouldReduceMotion ? 0 : [0, Math.cos(i) * 4, 0]
                }}
                transition={{
                  duration: 3 + (i * 0.1),
                  repeat: Infinity,
                  delay: animationPhase === 'intro' ? i * 0.05 : i * 0.2,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.g>

        {/* Intelligence Cores */}
        {cores.map((core, index) => (
          <motion.g
            key={core.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: animationPhase === 'intro' ? 0 : 1,
              scale: animationPhase === 'intro' ? 0.5 : 1,
              rotateY: animationPhase === 'idle' && !shouldReduceMotion ? [0, 4, 0, -4, 0] : 0,
              x: animationPhase === 'assembly' ? [0, -10, 0] : 0,
              y: animationPhase === 'assembly' ? [0, -5, 0] : 0
            }}
            transition={{
              opacity: { delay: shouldReduceMotion ? 0 : 1 + (index * 0.5), duration: 0.6 },
              scale: { delay: shouldReduceMotion ? 0 : 1 + (index * 0.5), duration: 0.6 },
              rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Outer atmospheric glow */}
            <motion.circle
              cx={core.position.x}
              cy={core.position.y}
              r="38"
              fill={core.glowColor}
              opacity="0.15"
              filter={`url(#glow-${core.id})`}
              animate={{
                opacity: animationPhase === 'idle' ? [0.1, 0.25, 0.1] : 0.15,
                scale: animationPhase === 'idle' ? [0.95, 1.05, 0.95] : 1
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Core shell - obsidian-black with beveled edges */}
            <motion.g
              animate={{
                scale: animationPhase === 'assembly' && index === 0 ? [0.8, 1.1, 1] : 1
              }}
              transition={{
                delay: animationPhase === 'assembly' ? index * 0.3 : 0,
                duration: 0.6,
                ease: "backOut"
              }}
            >
              {/* Main obsidian shell */}
              <motion.rect
                x={core.position.x - 24}
                y={core.position.y - 24}
                width="48"
                height="48"
                rx="12"
                fill="url(#obsidianGradient)"
                stroke={core.color}
                strokeWidth="2"
                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.05,
                  x: isHovered ? Math.random() * 8 - 4 : 0,
                  y: isHovered ? Math.random() * 8 - 4 : 0
                }}
              />
              
              {/* Inner beveled highlight */}
              <motion.rect
                x={core.position.x - 20}
                y={core.position.y - 20}
                width="40"
                height="40"
                rx="8"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              
              {/* Core energy cavity */}
              <motion.circle
                cx={core.position.x}
                cy={core.position.y}
                r="14"
                fill={`url(#coreGradient-${core.id})`}
                opacity="0.8"
                filter={`url(#glow-${core.id})`}
                animate={{
                  opacity: animationPhase === 'idle' ? [0.6, 1, 0.6] : 0.8,
                  scale: animationPhase === 'assembly' && index === 0 ? [0, 1] : 1
                }}
                transition={{
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { delay: index * 0.3 + 0.2, duration: 0.3, ease: "backOut" }
                }}
              />
            </motion.g>
            
            {/* Laser-etched label with assembly effect */}
            <motion.text
              x={core.position.x}
              y={core.position.y + 50}
              textAnchor="middle"
              className="font-poppins font-semibold text-xs tracking-wider"
              fill={core.color}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                filter: `drop-shadow(0 0 4px ${core.color}40)`
              }}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: animationPhase === 'intro' ? 0 : 1,
                pathLength: 1,
                filter: animationPhase === 'assembly' ? 
                  `drop-shadow(0 0 8px ${core.color}) drop-shadow(0 0 12px ${core.color}80)` :
                  `drop-shadow(0 0 4px ${core.color}40)`
              }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 1.2 + (index * 0.3),
                duration: animationPhase === 'assembly' ? 0.12 : 0.6,
                ease: "easeOut"
              }}
            >
              {core.label}
            </motion.text>
            
            {/* Connection lines */}
            {index < cores.length - 1 && (
              <motion.line
                x1={core.position.x}
                y1={core.position.y}
                x2={cores[index + 1].position.x}
                y2={cores[index + 1].position.y}
                stroke="url(#particleGradient)"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1
                }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : 2 + (index * 0.5),
                  duration: 0.8 
                }}
              />
            )}
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};