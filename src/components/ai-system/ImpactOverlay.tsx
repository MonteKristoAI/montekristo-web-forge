import { useEffect, useState } from "react";

interface Impact {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
}

const impacts: Impact[] = [
  { id: 1, text: "+12 hrs saved/wk", x: 450, y: 180, delay: 0 },
  { id: 2, text: "+240% reply rate", x: 200, y: 120, delay: 3000 },
  { id: 3, text: "+67% pipeline velocity", x: 480, y: 300, delay: 6000 },
  { id: 4, text: "+5x content output", x: 150, y: 350, delay: 9000 },
  { id: 5, text: "+43% close rate", x: 350, y: 100, delay: 12000 },
];

export const ImpactOverlay = () => {
  const [visibleImpacts, setVisibleImpacts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    impacts.forEach(impact => {
      const showTimer = setTimeout(() => {
        setVisibleImpacts(prev => new Set([...prev, impact.id]));
        
        const hideTimer = setTimeout(() => {
          setVisibleImpacts(prev => {
            const newSet = new Set(prev);
            newSet.delete(impact.id);
            return newSet;
          });
        }, 4000);
        
        timers.push(hideTimer);
      }, impact.delay);
      
      timers.push(showTimer);
    });

    const cycleTimer = setInterval(() => {
      impacts.forEach(impact => {
        const showTimer = setTimeout(() => {
          setVisibleImpacts(prev => new Set([...prev, impact.id]));
          
          const hideTimer = setTimeout(() => {
            setVisibleImpacts(prev => {
              const newSet = new Set(prev);
              newSet.delete(impact.id);
              return newSet;
            });
          }, 4000);
          
          timers.push(hideTimer);
        }, impact.delay);
        
        timers.push(showTimer);
      });
    }, 15000);

    timers.push(cycleTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {impacts.map(impact => (
        <div
          key={impact.id}
          className={`absolute transition-all duration-1000 ${
            visibleImpacts.has(impact.id)
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-4'
          }`}
          style={{
            left: impact.x,
            top: impact.y,
            transform: `translate(-50%, -50%) ${
              visibleImpacts.has(impact.id) ? 'translateY(0)' : 'translateY(16px)'
            }`,
          }}
        >
          <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white text-sm font-semibold px-3 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
            {impact.text}
          </div>
        </div>
      ))}
    </div>
  );
};