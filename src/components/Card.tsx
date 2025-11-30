import React from 'react';
import { HistoricalEvent } from '../types';
import { formatYear, getCategoryColorClass, getCategoryBorderColorClass } from '../utils/gameLogic';

interface CardProps {
  event: HistoricalEvent;
  showYear: boolean;
  isRevealing?: boolean;
  className?: string;
  rotation?: number;
}

const Card: React.FC<CardProps> = ({
  event,
  showYear,
  isRevealing = false,
  className = '',
  rotation = 0,
}) => {
  const bgColor = getCategoryColorClass(event.category);
  const borderColor = getCategoryBorderColorClass(event.category);

  const rotationStyle = {
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div
      className={`
        relative w-36 h-48 rounded-lg p-3
        ${bgColor} ${borderColor}
        border-4 shadow-sketch
        paper-texture
        flex flex-col justify-between
        transition-all duration-200
        ${isRevealing ? 'reveal-year' : ''}
        ${className}
      `}
      style={rotationStyle}
    >
      {/* Decorative corner flourishes */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br" />

      {/* Card content */}
      <div className="flex-1 flex items-center justify-center">
        <h3 className="text-white text-center font-hand text-lg leading-tight drop-shadow-md">
          {event.friendly_name}
        </h3>
      </div>

      {/* Year section - revealed or hidden */}
      <div className={`
        h-12 rounded-md flex items-center justify-center
        ${showYear ? 'bg-white/90' : 'bg-white/20 border-2 border-dashed border-white/40'}
        transition-all duration-300
      `}>
        {showYear ? (
          <span className="font-hand text-xl text-sketch font-bold">
            {formatYear(event.year)}
          </span>
        ) : (
          <span className="font-hand text-white/60 text-sm">
            ?
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
