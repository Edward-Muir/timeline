import React from 'react';
import { Hourglass, Compass, Crown, Feather, Globe, Scroll } from 'lucide-react';

const icons = [Hourglass, Compass, Crown, Feather, Globe, Scroll];

export const BackgroundPattern: React.FC = () => {
  // Create a grid large enough to cover viewport with some overflow
  const rows = 12;
  const cols = 16;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 100px)`,
          gridTemplateRows: `repeat(${rows}, 100px)`,
          width: '100vw',
          height: '100vh',
          minWidth: `${cols * 100}px`,
          minHeight: `${rows * 100}px`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={index}
              className="flex items-center justify-center"
            >
              <Icon
                size={32}
                strokeWidth={1.5}
                style={{
                  color: '#C4A574',
                  opacity: 0.15,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BackgroundPattern;
