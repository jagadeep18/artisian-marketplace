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
    // Generate just 15 elements to keep it subtle
    const newElements = Array.from({ length: 15 }).map((_, i) => {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
      const animationDuration = Math.floor(Math.random() * 20) + 20; // 20-40s (slower)
      const delay = (Math.random() * -40); // Negative delay
      
      const directions = ['floatUp', 'floatDown', 'floatLeft', 'floatRight'];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Restrict to the outer 10% of the screen borders
      const isStartEdge = Math.random() > 0.5;
      const boundaryPos = isStartEdge ? Math.random() * 10 : 90 + (Math.random() * 10);
      
      let positionStyle: React.CSSProperties = {};
      if (direction === 'floatUp' || direction === 'floatDown') {
        positionStyle = { left: `${boundaryPos}vw` };
      } else {
        positionStyle = { top: `${boundaryPos}vh` };
      }

      return {
        id: i,
        IconComponent,
        size,
        positionStyle,
        animationStyle: {
          animation: `${direction} ${animationDuration}s linear infinite`,
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
