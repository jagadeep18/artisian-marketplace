import React, { useEffect, useState } from 'react';
import { Sparkles, Palette, Scissors, Hammer, Star, Heart, Feather } from 'lucide-react';

// Predefined set of icons related to artisanship and beauty
const icons = [Sparkles, Palette, Scissors, Hammer, Star, Heart, Feather];

interface FloatingIconProps {
  id: number;
  IconComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  size: number;
  left: number;
  animationDuration: number;
  delay: number;
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
    // Generate 15 random animated elements
    const newElements = Array.from({ length: 15 }).map((_, i) => {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      return {
        id: i,
        IconComponent,
        size: Math.floor(Math.random() * 24) + 16, // Size between 16px and 40px
        left: Math.floor(Math.random() * 100), // Random left position (0-100vw)
        animationDuration: Math.floor(Math.random() * 10) + 15, // Duration 15-25s
        delay: Math.floor(Math.random() * 15), // Random delay
        colorClass: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {elements.map((el) => {
        const Icon = el.IconComponent;
        return (
          <div
            key={el.id}
            className={`absolute bottom-[-50px] opacity-0 ${el.colorClass}`}
            style={{
              left: `${el.left}vw`,
              animation: `floatUp ${el.animationDuration}s linear infinite`,
              animationDelay: `${el.delay}s`,
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
