import { useState, useEffect } from "react";

interface GameCharacterProps {
  level: number;
  experience: number;
  isActive?: boolean;
}

export const GameCharacter = ({ level, experience, isActive = false }: GameCharacterProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Character appearance changes based on level
  const getCharacterEmoji = () => {
    if (level >= 20) return "🧙‍♂️"; // Wizard
    if (level >= 15) return "⚔️"; // Knight
    if (level >= 10) return "🛡️"; // Guardian
    if (level >= 5) return "🎯"; // Archer
    return "👤"; // Novice
  };

  const getCharacterTitle = () => {
    if (level >= 20) return "Master";
    if (level >= 15) return "Expert";
    if (level >= 10) return "Advanced";
    if (level >= 5) return "Intermediate";
    return "Novice";
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${isAnimating ? 'animate-level-up' : ''}`}>
      <div className="text-6xl animate-bounce-subtle">
        {getCharacterEmoji()}
      </div>
      <div className="text-center">
        <div className="level-badge">
          LVL {level}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {getCharacterTitle()}
        </div>
        <div className="exp-badge mt-1">
          {experience} XP
        </div>
      </div>
    </div>
  );
};