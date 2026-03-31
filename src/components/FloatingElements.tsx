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
    // Generate 20 border elements for a visible but non-intrusive flow
    const newElements = Array.from({ length: 20 }).map((_, i) => {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
      const animationDuration = Math.floor(Math.random() * 20) + 15; // 15-35s
      const delay = (Math.random() * -35); // Random offset so they appear immediately
      
      const directions = ['travelUp', 'travelDown'];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Determine if it should be locked to the left or right border
      const isLeft = Math.random() > 0.5;
      const xPos = isLeft ? Math.random() * 6 + 1 : Math.random() * 6 + 93; // 1-7vw OR 93-99vw

      return {
        id: i,
        IconComponent,
        size,
        positionStyle: { left: `${xPos}vw` }, // Only lock X axis, animation handles Y axis
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
