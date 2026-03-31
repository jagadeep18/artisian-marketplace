import React, { useEffect, useState } from 'react';
import { Sparkles, Palette, Scissors, Hammer, Star, Heart, Feather } from 'lucide-react';

// Predefined set of icons related to artisanship and beauty
const icons = [Sparkles, Palette, Scissors, Hammer, Star, Heart, Feather];

interface FloatingIconProps {
  id: number;
  IconComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  size: number;
  positionStyle: React.CSSProperties;
  animationStyle: React.CSSProperties;
  colorClass: string;
}

const colors = [
  'text-orange-400',
  'text-yellow-400',
  'text-pink-400',
  'text-indigo-400',
  'text-rose-400',
  'text-amber-400'
];

const FloatingElements = () => {
  const [elements, setElements] = useState<FloatingIconProps[]>([]);

  useEffect(() => {
    // Generate exactly 15 border elements
    const newElements = Array.from({ length: 15 }).map((_, i) => {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
      const animationDuration = Math.floor(Math.random() * 15) + 15; // 15-30s
      const delay = (Math.random() * -30); // Random offset
      
      // Determine if it should be on the left or right border
      const isLeft = Math.random() > 0.5;
      const xPos = isLeft ? Math.random() * 6 + 2 : Math.random() * 6 + 92; // 2-8vw OR 92-98vw
      const yPos = Math.random() * 90 + 5; // Spread vertically 5-95vh

      return {
        id: i,
        IconComponent,
        size,
        positionStyle: { left: `${xPos}vw`, top: `${yPos}vh` },
        animationStyle: {
          animation: `driftSubtle ${animationDuration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        },
        colorClass: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {elements.map((el) => {
        const Icon = el.IconComponent;
        return (
          <div
            key={el.id}
            className={`absolute z-0 opacity-0 ${el.colorClass}`}
            style={{
              ...el.positionStyle,
              ...el.animationStyle,
            }}
          >
            <Icon 
              className="drop-shadow-lg" 
              style={{ width: `${el.size}px`, height: `${el.size}px` }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingElements;
