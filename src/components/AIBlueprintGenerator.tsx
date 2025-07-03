
import { LivingAISystem } from "./hero/LivingAISystem";

interface AIBlueprintGeneratorProps {
  className?: string;
}

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  return (
    <div className={`relative ${className}`}>
      <LivingAISystem />
    </div>
  );
};
