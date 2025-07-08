import { motion, AnimatePresence } from 'framer-motion';
import { TooltipData } from './types';

interface TooltipPanelProps {
  tooltip: TooltipData;
}

export const TooltipPanel = ({ tooltip }: TooltipPanelProps) => {
  return (
    <AnimatePresence>
      {tooltip.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-black/80 border border-white/20 rounded-lg p-4 shadow-xl backdrop-blur-sm max-w-xs">
            <h3 className="font-inter font-semibold text-sm text-white mb-1" style={{ letterSpacing: '0.02em' }}>
              {tooltip.node.label}
            </h3>
            <p className="font-inter text-xs text-gray-300 leading-relaxed" style={{ lineHeight: '1.4', letterSpacing: '0.01em' }}>
              {tooltip.node.description}
            </p>
            {tooltip.node.impact && (
              <div className="mt-2 px-2 py-1 bg-white/10 rounded text-xs font-medium text-white border border-white/20">
                {tooltip.node.impact}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0, 0, 0, 0.8)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};