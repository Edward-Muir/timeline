import React from 'react';
import { Hourglass, Compass, Crown, Feather, Globe, Scroll } from 'lucide-react';

const icons = [Hourglass, Compass, Crown, Feather, Globe, Scroll];

export const BackgroundPattern: React.FC = () => {
  const rows = 12;
  const cols = 16;
  const cellSize = 100;
  const offset = 50; // Half cell width for brick/honeycomb offset

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div className="relative" style={{ width: '100vw', height: '100vh' }}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{
              marginLeft: rowIndex % 2 === 1 ? `${offset}px` : '0',
            }}
          >
            {Array.from({ length: cols + 1 }).map((_, colIndex) => {
              const iconIndex = (rowIndex * cols + colIndex) % icons.length;
              const Icon = icons[iconIndex];
              return (
                <div
                  key={colIndex}
                  className="flex items-center justify-center"
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
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
        ))}
      </div>
    </div>
  );
};

export default BackgroundPattern;
